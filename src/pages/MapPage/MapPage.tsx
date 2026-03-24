import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { KharkivMap } from '../../components/Map/KharkivMap'
import { MobileIncidentsFeed } from '../../components/Map/MobileIncidentsFeed'
import { MapTour } from '../../components/Onboarding/MapTour'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export function MapPage() {
  const isMobile = useMediaQuery('(max-width: 639px)')

  return (
    <div className="flex min-h-svh flex-col px-4 py-4 sm:px-6">
      <header className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <Link
            to="/"
            className="text-sm text-slate-500 transition hover:text-cyan-400"
          >
            ← На головну
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Карта теплових кластерів</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Клік по району — детальна статистика. Оновлення симуляції кожні ~1,6 с.
          </p>
        </div>
        <motion.div
          layout
          className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] backdrop-blur-md sm:gap-3 sm:px-4 sm:py-3 sm:text-xs"
          data-tour="legend"
        >
          <span className="flex items-center gap-1.5 text-slate-300 sm:gap-2">
            <span className="size-2.5 rounded-sm bg-emerald-500/85 shadow-[0_0_8px_rgba(52,211,153,0.4)] sm:size-3 sm:shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
            <span className="sm:hidden">Ок</span>
            <span className="hidden sm:inline">Стабільно</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300 sm:gap-2">
            <span className="size-2.5 rounded-sm bg-amber-400/90 sm:size-3" />
            <span className="sm:hidden">Пік</span>
            <span className="hidden sm:inline">Високе навантаження</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300 sm:gap-2">
            <span className="size-2.5 rounded-sm bg-rose-500/90 sm:size-3" />
            <span className="sm:hidden">Ризик</span>
            <span className="hidden sm:inline">Проблема / атака</span>
          </span>
        </motion.div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4">
        <KharkivMap />
        {isMobile && <MobileIncidentsFeed />}
      </div>

      <MapTour />
    </div>
  )
}
