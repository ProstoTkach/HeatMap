import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DistrictCharts } from '../../components/Charts/DistrictCharts'
import { DistrictPanelTour } from '../../components/Onboarding/DistrictPanelTour'
import { StatusBadge } from '../../components/StatusBadge/StatusBadge'
import { CLUSTER_POWER_MW, districtById } from '../../data/districts'
import { useEnergyStore, statusLabel } from '../../store/useEnergyStore'

export function DistrictPage() {
  const { id } = useParams()
  const meta = id ? districtById[id] : undefined
  const data = useEnergyStore((s) => (id ? s.districts[id] : undefined))
  const simTime = useEnergyStore((s) => s.simTime)
  const allEvents = useEnergyStore((s) => s.events)

  const events = useMemo(() => {
    if (!id) return []
    return allEvents.filter((e) => e.districtId === id).slice(0, 14)
  }, [allEvents, id])

  if (!id || !meta || !data) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-xl text-white">Район не знайдено</h1>
        <Link to="/map" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
          Повернутися до карти
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <DistrictPanelTour />
      <Link to="/map" className="text-sm text-slate-500 hover:text-cyan-400">
        ← Карта міста
      </Link>
      <motion.header
        className="mt-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        data-tour="district-metrics"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">{meta.name}</h1>
            <p className="mt-1 text-slate-500">Кластер №{meta.id} · номінал ~{CLUSTER_POWER_MW} МВт</p>
          </div>
          <StatusBadge status={data.status} />
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/5 bg-black/25 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Поточне навантаження</dt>
            <dd className="mt-1 font-mono text-2xl text-cyan-300">{data.loadPct.toFixed(1)}%</dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/25 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Температура мережі</dt>
            <dd className="mt-1 font-mono text-2xl text-sky-200">{data.networkTempC.toFixed(1)} °C</dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/25 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Виробництво тепла</dt>
            <dd className="mt-1 font-mono text-2xl text-emerald-200">{data.productionMW.toFixed(2)} МВт</dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/25 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-500">CO₂ економія (оцінка)</dt>
            <dd className="mt-1 font-mono text-2xl text-lime-200">{data.co2SavedKgPerH.toFixed(0)} кг/год</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-slate-400">
          Статус: <span className="text-slate-200">{statusLabel(data.status)}</span>
          {simTime < data.neighborBoostUntil && (
            <span className="ml-2 text-amber-400/90">· підвищений потік від сусідів</span>
          )}
        </p>
      </motion.header>
      
      <section className="mt-10" data-tour="district-events">
        <h2 className="mb-3 text-lg font-medium text-white">Події мережі (район)</h2>
        <ul className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md">
          {events.length === 0 && (
            <li className="text-sm text-slate-500">Подій ще немає — очікуйте симуляцію…</li>
          )}
          {events.map((e) => (
            <motion.li
              key={e.id}
              layout
              className="border-b border-white/5 pb-2 text-sm text-slate-300 last:border-0 last:pb-0"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="font-mono text-xs text-slate-500">
                {new Date(e.at).toLocaleTimeString('uk-UA')}
              </span>
              <span className="ml-2">{e.message}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-white">Графіки</h2>
        <DistrictCharts
          loadHistory={data.loadHistory}
          tempHistory={data.tempHistory}
          prodHistory={data.prodHistory}
          stabilityHistory={data.stabilityHistory}
        />
      </section>

    </div>
  )
}
