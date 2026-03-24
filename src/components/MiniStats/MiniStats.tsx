import { motion } from 'framer-motion'
import type { DistrictRuntime } from '../../types/district'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import { statusLabel } from '../../store/useEnergyStore'

export function MiniStats({
  data,
  small,
  mapMobile,
}: {
  data: DistrictRuntime
  small?: boolean
  /** Лише % навантаження без підписів (мобільна карта) */
  mapMobile?: boolean
}) {
  if (mapMobile) {
    return (
      <motion.div
        layout
        className="pointer-events-none rounded-md border border-white/15 bg-black/70 px-2 py-1 text-center font-mono text-3xl font-semibold text-cyan-300 shadow-lg backdrop-blur-md"
        style={{ zIndex: 30 }}
      >
        {data.loadPct.toFixed(0)}%
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      className={`pointer-events-none grid gap-0.5 rounded-md 
        border border-white/10 bg-black/55 px-2 py-1.5 
        text-left shadow-lg backdrop-blur-md 
        ${small ? 'text-[12px] leading-tight' : 'text-[16px] leading-snug'}`}
      style={{ zIndex: 30 }}
    >
      <div className={`flex flex-wrap items-center gap-1 
        ${small ? 'text-[14px] leading-tight' : 'text-[16px] leading-snug'}`}>
        <span className="text-slate-400">Load</span>
        <span className="font-mono text-cyan-300">{data.loadPct.toFixed(0)}%</span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-slate-400">T°</span>
        <span className="font-mono text-sky-200">{data.networkTempC.toFixed(1)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-slate-400">Q</span>
        <span className="font-mono text-emerald-200/90">{data.productionMW.toFixed(1)} MW</span>
      </div>
      <div className="mt-0.5 scale-90 origin-left" title={statusLabel(data.status)}>
        <StatusBadge status={data.status} compact />
      </div>
    </motion.div>
  )
}
