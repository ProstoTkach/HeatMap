import { randomIncidentMessage } from '../data/networkIncidentTemplates'
import { CLUSTER_POWER_MW, DISTRICTS, districtById } from '../data/districts'
import type {
  DistrictRuntime,
  HistoryPoint,
  NetworkEvent,
  SystemStatus,
} from '../types/district'

const HISTORY_LEN = 48
const TICK_MS = 1600

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

function pushHistory(arr: HistoryPoint[], v: number, t: number) {
  const next = [...arr, { t, v }]
  if (next.length > HISTORY_LEN) next.splice(0, next.length - HISTORY_LEN)
  return next
}

function deriveStatus(
  load: number,
  incidentActive: boolean,
  neighborBoost: boolean,
): SystemStatus {
  if (incidentActive) return 'problem'
  if (load >= 82 || neighborBoost) return 'high'
  if (load >= 68) return 'high'
  return 'stable'
}

function initialRuntime(seed: number): DistrictRuntime {
  const base = 48 + (seed % 20)
  const t = Date.now()
  const load = base
  const temp = 68 + load * 0.12
  const prod = (CLUSTER_POWER_MW * load) / 100
  const stab = 88 - Math.abs(load - 55) * 0.35
  const z = (n: number) =>
    Array.from({ length: 12 }, (_, i) => ({ t: t - (12 - i) * 2000, v: n + (Math.random() - 0.5) * 3 }))
  return {
    loadPct: load,
    networkTempC: temp,
    productionMW: prod,
    stability: clamp(stab, 40, 99),
    co2SavedKgPerH: 420 + load * 4.2,
    status: deriveStatus(load, false, false),
    incidentUntil: 0,
    neighborBoostUntil: 0,
    loadHistory: z(load),
    tempHistory: z(temp),
    prodHistory: z(prod),
    stabilityHistory: z(stab),
  }
}

export function createInitialDistricts(): Record<string, DistrictRuntime> {
  const out: Record<string, DistrictRuntime> = {}
  DISTRICTS.forEach((d, i) => {
    out[d.id] = initialRuntime(i * 7 + 13)
  })
  return out
}

function randomId(): string {
  const d = DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)]
  return d.id
}

export function tickDistricts(
  prev: Record<string, DistrictRuntime>,
  now: number,
): Record<string, DistrictRuntime> {
  const next: Record<string, DistrictRuntime> = {}
  for (const d of DISTRICTS) {
    const r = prev[d.id]
    let load = r.loadPct + (Math.random() - 0.5) * 4
    if (now < r.neighborBoostUntil) load += 3.5
    load = clamp(load, 28, 98)

    let temp = r.networkTempC + (Math.random() - 0.5) * 0.9 + (load - r.loadPct) * 0.06
    temp = clamp(temp, 62, 96)

    const prod = clamp(
      (CLUSTER_POWER_MW * load) / 100 + (Math.random() - 0.5) * 0.4,
      2,
      CLUSTER_POWER_MW,
    )
    let stab = r.stability + (Math.random() - 0.5) * 2 - Math.abs(load - 60) * 0.02
    stab = clamp(stab, 35, 99)

    const incidentActive = now < r.incidentUntil
    const neighborBoost = now < r.neighborBoostUntil
    const status = deriveStatus(load, incidentActive, neighborBoost)

    next[d.id] = {
      ...r,
      loadPct: load,
      networkTempC: temp,
      productionMW: prod,
      stability: stab,
      co2SavedKgPerH: 380 + load * 4.8 + (incidentActive ? -40 : 0),
      status,
      incidentUntil: r.incidentUntil,
      neighborBoostUntil: r.neighborBoostUntil,
      loadHistory: pushHistory(r.loadHistory, load, now),
      tempHistory: pushHistory(r.tempHistory, temp, now),
      prodHistory: pushHistory(r.prodHistory, prod, now),
      stabilityHistory: pushHistory(r.stabilityHistory, stab, now),
    }
  }
  return next
}

export function maybeSpawnEvent(
  districts: Record<string, DistrictRuntime>,
  now: number,
): {
  districts: Record<string, DistrictRuntime>
  events: NetworkEvent[]
  toasts: string[]
} {
  const roll = Math.random()
  const d = { ...districts }
  const events: NetworkEvent[] = []
  const toasts: string[] = []
  const id = randomId()
  const meta = districtById[id]
  if (!meta) return { districts: d, events, toasts }

  if (roll < 0.04) {
    const r = d[id]
    d[id] = {
      ...r,
      loadPct: clamp(r.loadPct + 8 + Math.random() * 7, 30, 99),
    }
    events.push({
      id: `${now}-u`,
      districtId: id,
      message: `Зростання навантаження: ${randomIncidentMessage()}`,
      at: now,
    })
    return { districts: d, events, toasts }
  }
  if (roll < 0.08) {
    const r = d[id]
    d[id] = {
      ...r,
      loadPct: clamp(r.loadPct - 7 - Math.random() * 6, 25, 95),
    }
    events.push({
      id: `${now}-d`,
      districtId: id,
      message: `Зниження навантаження: ${randomIncidentMessage()}`,
      at: now,
    })
    return { districts: d, events, toasts }
  }
  if (roll < 0.095) {
    const r = d[id]
    const until = now + 28000 + Math.random() * 12000
    d[id] = {
      ...r,
      incidentUntil: until,
      loadPct: clamp(r.loadPct + 5, 40, 99),
    }
    events.push({
      id: `${now}-i`,
      districtId: id,
      message: `Аварія / аномалія в «${meta.name}»: ${randomIncidentMessage()} — перерозподіл на сусіди`,
      at: now,
    })
    toasts.push(`Аварія в «${meta.name}» — перерозподіл на сусідів`)
    for (const nid of meta.neighbors) {
      const nr = d[nid]
      if (!nr) continue
      const nName = districtById[nid]?.name ?? nid
      d[nid] = {
        ...nr,
        neighborBoostUntil: Math.max(nr.neighborBoostUntil, now + 22000),
        loadPct: clamp(nr.loadPct + 6 + Math.random() * 5, 30, 99),
      }
      events.push({
        id: `${now}-in-${nid}`,
        districtId: nid,
        message: `Додатковий потік у «${nName}» через подію в сусідньому «${meta.name}»`,
        at: now,
      })
    }
    return { districts: d, events, toasts }
  }
  if (roll < 0.115) {
    const nids = [...meta.neighbors]
    if (nids.length >= 2) {
      const a = nids[Math.floor(Math.random() * nids.length)]
      let b = nids[Math.floor(Math.random() * nids.length)]
      if (b === a) b = nids[0]
      const shift = 4 + Math.random() * 5
      const ra = d[a]
      const rb = d[b]
      if (ra && rb) {
        d[a] = { ...ra, loadPct: clamp(ra.loadPct + shift, 28, 96) }
        d[b] = { ...rb, loadPct: clamp(rb.loadPct - shift * 0.7, 28, 96) }
        events.push({
          id: `${now}-r`,
          districtId: id,
          message: `Перерозподіл між «${districtById[a]?.name}» та «${districtById[b]?.name}»: ${randomIncidentMessage()}`,
          at: now,
        })
        return { districts: d, events, toasts }
      }
    }
  }
  return { districts: d, events, toasts }
}

export { TICK_MS }
