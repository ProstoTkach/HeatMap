import { motion } from 'framer-motion'
import type { SystemStatus } from '../../types/district'

const cfg: Record<
  SystemStatus,
  { label: string; ring: string; bg: string; dot: string }
> = {
  stable: {
    label: 'Стабільно',
    ring: 'ring-emerald-500/40',
    bg: 'bg-emerald-500/15',
    dot: 'bg-emerald-400',
  },
  high: {
    label: 'Високе навантаження',
    ring: 'ring-amber-400/50',
    bg: 'bg-amber-500/15',
    dot: 'bg-amber-400',
  },
  problem: {
    label: 'Проблема',
    ring: 'ring-rose-500/50',
    bg: 'bg-rose-500/15',
    dot: 'bg-rose-500',
  },
}

export function StatusBadge({
  status,
  compact,
}: {
  status: SystemStatus
  compact?: boolean
}) {
  const c = cfg[status]
  return (
    <motion.span
      layout
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${c.ring} ${c.bg} text-slate-100`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      title={compact ? c.label : undefined}
    >
      <span className={`size-2 rounded-full ${c.dot} ${status === 'problem' ? 'animate-pulse' : ''}`} />
      {!compact && c.label}
      {compact && <span className="sr-only">{c.label}</span>}
    </motion.span>
  )
}
