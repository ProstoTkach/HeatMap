import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { DistrictRuntime } from '../../types/district'
import { CLUSTER_POWER_MW } from '../../data/districts'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import { statusLabel } from '../../store/useEnergyStore'

export function DistrictCard({
  id,
  name,
  data,
}: {
  id: string
  name: string
  data: DistrictRuntime
}) {
  return (
    <motion.article
      layout
      className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-lg backdrop-blur-md transition-colors hover:border-cyan-500/30"
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-xs text-slate-500">~{CLUSTER_POWER_MW} МВ номіналу</p>
        </div>
        <StatusBadge status={data.status} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-slate-500">Навантаження</dt>
          <dd className="font-mono text-cyan-300">{data.loadPct.toFixed(0)}%</dd>
        </div>
        <div>
          <dt className="text-slate-500">Температура</dt>
          <dd className="font-mono text-sky-200">{data.networkTempC.toFixed(1)} °C</dd>
        </div>
        <div>
          <dt className="text-slate-500">Виробництво</dt>
          <dd className="font-mono text-emerald-200">{data.productionMW.toFixed(2)} МВт</dd>
        </div>
        <div>
          <dt className="text-slate-500">Статус</dt>
          <dd className="text-slate-300">{statusLabel(data.status)}</dd>
        </div>
      </dl>
      <Link
        to={`/district/${id}`}
        className="mt-3 inline-flex text-sm font-medium text-cyan-400 hover:text-cyan-300"
      >
        Детальна панель →
      </Link>
    </motion.article>
  )
}
