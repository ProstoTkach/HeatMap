import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  DISTRICTS,
  KHARKIV_MAP_HEIGHT,
  KHARKIV_VIEWBOX,
} from '../../data/districts'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useEnergyStore } from '../../store/useEnergyStore'
import type { DistrictRuntime } from '../../types/district'
import { MiniStats } from '../MiniStats/MiniStats'
import { statusFill, statusStroke } from '../../utils/statusColors'

const LABEL_TOP = 28
const LABEL_GAP = 6

export function KharkivMap() {
  const navigate = useNavigate()
  const districts = useEnergyStore((s) => s.districts)
  const isMobile = useMediaQuery('(max-width: 639px)')

  return (
    <div
      className="relative w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#060a10] shadow-2xl"
      data-tour="map-stage"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.06),transparent_55%)]" />
      <svg
        viewBox={KHARKIV_VIEWBOX}
        className="relative z-10 h-auto w-full max-h-[min(70vh,520px)] sm:max-h-[80vh]"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Карта Харкова з тепловими кластерами"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {!isMobile && (
          <text
            x={500}
            y={LABEL_TOP}
            textAnchor="middle"
            className="fill-slate-500 text-[13px] font-medium"
          >
            Харків · адміністративні межі · теплові хаби
          </text>
        )}


        {DISTRICTS.map((d) => (
          <path
            key={`b-${d.id}`}
            d={d.path}
            fill="#0d1218"
            className="pointer-events-none"
          />
        ))}

        {DISTRICTS.map((d) => (
          <path
            key={`r-${d.id}`}
            d={d.path}
            fill="none"
            stroke="rgba(148, 163, 184, 0.14)"
            strokeWidth={0.55}
            className="pointer-events-none"
          />
        ))}

        {DISTRICTS.map((d) => {
          const run = districts[d.id] as DistrictRuntime | undefined
          if (!run) return null
          const fill = statusFill(run.status, run.loadPct)
          const stroke = statusStroke(run.status)
          const go = () => navigate(`/district/${d.id}`)
          return (
            <g
              key={d.id}
              className="group cursor-pointer outline-none"
              role="link"
              tabIndex={0}
              aria-label={`${d.name}: відкрити деталі`}
              onClick={go}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  go()
                }
              }}
            >
              <motion.path
                d={d.path}
                fill={fill}
                stroke={stroke}
                strokeWidth={1.1}
                className="transition-all duration-300 group-hover:stroke-[2.2] group-hover:brightness-125 group-focus-visible:stroke-[2.2]"
                filter="url(#glow)"
                initial={false}
                animate={{ fill, stroke }}
                fillOpacity={0.72}
                data-district={d.id}
              />
              <path
                d={d.path}
                fill="rgba(0,0,0,0)"
                stroke="none"
                pointerEvents="all"
                aria-hidden
              />
            </g>
          )
        })}

        <g className="pointer-events-none" style={{ isolation: 'isolate' }}>
          {DISTRICTS.map((d) => {
            const run = districts[d.id] as DistrictRuntime | undefined
            if (!run) return null
            const lx = d.label.x + d.labelOffset.dx
            const ly = Math.min(
              Math.max(d.label.y + d.labelOffset.dy, LABEL_TOP + LABEL_GAP + 40),
              KHARKIV_MAP_HEIGHT - 8,
            )
            return (
              <g key={`lab-${d.id}`}>
                {!isMobile && (
                  <text
                    x={lx}
                    y={ly - 10}
                    textAnchor="middle"
                    className="fill-slate-100 text-[10px] font-semibold sm:text-[14px]"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.85)' }}
                  >
                    {d.name}
                  </text>
                )}
                <foreignObject
                  x={lx - (isMobile ? 22 : 54)}
                  y={ly}
                  width={isMobile ? 44 : 108}
                  height={isMobile ? 32 : 76}
                  className="overflow-visible"
                  style={{ zIndex: 50 }}
                >
                  <div
                    className="flex justify-center"
                    data-tour="map-ministats"
                    style={{ position: 'relative', zIndex: 50 }}
                  >
                    <MiniStats data={run} small={!isMobile} mapMobile={isMobile} />
                  </div>
                </foreignObject>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
