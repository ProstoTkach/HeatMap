import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { districtById } from '../../data/districts'
import { useEnergyStore } from '../../store/useEnergyStore'

const INCIDENT_RE = /аварія|аномалія|збій|перегрів|витік|тривога|кібер/i

export function MobileIncidentsFeed() {
  const events = useEnergyStore((s) => s.events)

  const rows = useMemo(() => {
    return events
      .filter((e) => INCIDENT_RE.test(e.message))
      .slice(0, 6)
      .map((e) => ({
        ...e,
        districtName: districtById[e.districtId]?.name ?? e.districtId,
      }))
  }, [events])

  return (
    <div className="w-full rounded-xl border border-rose-500/20 bg-slate-950/40 p-4 backdrop-blur-md">
      <h3 className="text-sm font-semibold text-slate-200">Останні аварії та аномалії</h3>
      <p className="mb-3 text-xs text-slate-500">З журналу симуляції мережі</p>
      <ul className="space-y-2">
        {rows.length === 0 && (
          <li className="text-sm text-slate-500">Подій поки немає — очікуйте симуляцію…</li>
        )}
        {rows.map((e) => (
          <motion.li
            key={e.id}
            layout
            className="rounded-lg border border-white/5 bg-black/25 px-3 py-2 text-sm text-slate-300"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-mono text-[10px] text-slate-500">
              {new Date(e.at).toLocaleTimeString('uk-UA')}
            </span>
            <span className="ml-2 text-xs text-rose-300/90">{e.districtName}</span>
            <p className="mt-1 text-xs leading-snug text-slate-400">{e.message}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
