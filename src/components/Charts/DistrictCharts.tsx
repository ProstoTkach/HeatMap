import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { HistoryPoint } from '../../types/district'

function fmtTime(t: number) {
  const d = new Date(t)
  return d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function toChartData(points: HistoryPoint[]) {
  return points.map((p) => ({ time: fmtTime(p.t), raw: p.t, v: Number(p.v.toFixed(2)) }))
}

const tooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.92)',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  borderRadius: 8,
  fontSize: 12,
}

function Panel({
  title,
  children,
  delay,
  dataTour,
}: {
  title: string
  children: ReactNode
  delay: number
  dataTour?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="rounded-xl border border-white/10 bg-slate-950/50 p-3 backdrop-blur-md"
      data-tour={dataTour}
    >
      <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">{title}</h4>
      <div className="h-40 w-full min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export function DistrictCharts({
  loadHistory,
  tempHistory,
  prodHistory,
  stabilityHistory,
}: {
  loadHistory: HistoryPoint[]
  tempHistory: HistoryPoint[]
  prodHistory: HistoryPoint[]
  stabilityHistory: HistoryPoint[]
}) {
  const loadD = toChartData(loadHistory)
  const tempD = toChartData(tempHistory)
  const prodD = toChartData(prodHistory)
  const stabD = toChartData(stabilityHistory)

  return (
    <div className="grid gap-4 md:grid-cols-2" data-tour="district-charts">
      <Panel title="Історія навантаження (%)" delay={0} dataTour="district-chart-load">
        <AreaChart data={loadD} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gLoad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
          <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 10 }} width={36} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#94a3b8' }} />
          <Area type="monotone" dataKey="v" stroke="#22d3ee" fill="url(#gLoad)" strokeWidth={2} isAnimationActive={false} />
        </AreaChart>
      </Panel>
      <Panel title="Температура мережі (°C)" delay={0.05}>
        <LineChart data={tempD} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
          <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 10 }} width={36} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="v" stroke="#38bdf8" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </Panel>
      <Panel title="Виробництво тепла (МВт)" delay={0.1}>
        <AreaChart data={prodD} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gProd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
          <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 10 }} width={36} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="v" stroke="#34d399" fill="url(#gProd)" strokeWidth={2} isAnimationActive={false} />
        </AreaChart>
      </Panel>
      <Panel title="Стабільність системи" delay={0.15}>
        <LineChart data={stabD} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
          <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} width={36} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="v" stroke="#a78bfa" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </Panel>
    </div>
  )
}
