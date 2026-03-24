import { create } from 'zustand'
import type { DistrictRuntime, HistoryPoint, NetworkEvent } from '../types/district'
import { DISTRICTS } from '../data/districts'
import {
  createInitialDistricts,
  maybeSpawnEvent,
  tickDistricts,
  TICK_MS,
} from './simulationEngine'

const ONBOARD_KEY = 'kharkiv-heat-hub-onboarding'
const SEED_EVENTS_KEY = 'kharkiv-heat-hub-seeded'

interface EnergyState {
  districts: Record<string, DistrictRuntime>
  events: NetworkEvent[]
  /** Середня навантаження по місту для міні-графіка */
  cityLoadHistory: HistoryPoint[]
  simTime: number
  simulationOn: boolean
  tickHandle: ReturnType<typeof setInterval> | null
  onboardingDone: boolean
  onboardingStep: number
  startSimulation: () => void
  stopSimulation: () => void
  tickOnce: () => void
  completeOnboarding: () => void
  setOnboardingStep: (n: number) => void
  seedInitialEvents: () => void
  toasts: { id: string; message: string }[]
  pushToast: (message: string) => void
  removeToast: (id: string) => void
}

function loadOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARD_KEY) === '1'
  } catch {
    return false
  }
}

export const useEnergyStore = create<EnergyState>((set, get) => ({
  districts: createInitialDistricts(),
  events: [],
  cityLoadHistory: [],
  simTime: Date.now(),
  simulationOn: false,
  tickHandle: null,
  onboardingDone: typeof localStorage !== 'undefined' ? loadOnboarding() : true,
  onboardingStep: 0,

  setOnboardingStep: (n) => set({ onboardingStep: n }),

  toasts: [],

  pushToast: (message) =>
    set((s) => ({
      toasts: [...s.toasts, { id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, message }].slice(
        -6,
      ),
    })),

  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  completeOnboarding: () => {
    try {
      localStorage.setItem(ONBOARD_KEY, '1')
    } catch {
      /* ignore */
    }
    set({ onboardingDone: true, onboardingStep: 0 })
  },

  seedInitialEvents: () => {
    try {
      if (localStorage.getItem(SEED_EVENTS_KEY)) return
      localStorage.setItem(SEED_EVENTS_KEY, '1')
    } catch {
      return
    }
    const now = Date.now()
    const seeded: NetworkEvent[] = [
      {
        id: 'seed-1',
        districtId: '5',
        message: 'Індустріальний: підвищене навантаження на промисловий сектор',
        at: now - 8000,
      },
      {
        id: 'seed-2',
        districtId: '1',
        message: 'Шевченківський: стабільний режим, резерв потужності ~18%',
        at: now - 4000,
      },
    ]
    set((s) => ({ events: [...seeded, ...s.events].slice(0, 80) }))
  },

  tickOnce: () => {
    const now = Date.now()
    let { districts } = get()
    districts = tickDistricts(districts, now)
    const spawned = maybeSpawnEvent(districts, now)
    districts = spawned.districts
    const mergedEvents = [...spawned.events, ...get().events].slice(0, 80)
    let sum = 0
    for (const x of DISTRICTS) {
      sum += districts[x.id]?.loadPct ?? 0
    }
    const avgCity = DISTRICTS.length ? sum / DISTRICTS.length : 0
    set((s) => ({
      districts,
      simTime: now,
      events: mergedEvents,
      cityLoadHistory: [...s.cityLoadHistory, { t: now, v: avgCity }].slice(-40),
      toasts: [
        ...s.toasts,
        ...spawned.toasts.map((msg, i) => ({
          id: `toast-${now}-${i}-${Math.random().toString(36).slice(2, 9)}`,
          message: msg,
        })),
      ].slice(-6),
    }))
  },

  startSimulation: () => {
    const { tickHandle, simulationOn } = get()
    if (simulationOn && tickHandle) return
    if (tickHandle) clearInterval(tickHandle)
    const h = setInterval(() => get().tickOnce(), TICK_MS)
    set({ simulationOn: true, tickHandle: h })
    get().seedInitialEvents()
  },

  stopSimulation: () => {
    const { tickHandle } = get()
    if (tickHandle) clearInterval(tickHandle)
    set({ simulationOn: false, tickHandle: null })
  },
}))

export function statusLabel(s: DistrictRuntime['status']): string {
  switch (s) {
    case 'stable':
      return 'Стабільно'
    case 'high':
      return 'Високе навантаження'
    case 'problem':
      return 'Проблема / атака'
    default:
      return s
  }
}

