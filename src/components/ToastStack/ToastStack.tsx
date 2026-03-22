import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useEnergyStore } from '../../store/useEnergyStore'

const AUTO_DISMISS_MS = 6000

function ToastItem({ id, message }: { id: string; message: string }) {
  const removeToast = useEnergyStore((s) => s.removeToast)

  useEffect(() => {
    const t = window.setTimeout(() => removeToast(id), AUTO_DISMISS_MS)
    return () => window.clearTimeout(t)
  }, [id, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 56 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="pointer-events-auto rounded-xl border border-cyan-500/25 bg-slate-950/95 px-4 py-3 text-sm text-slate-200 shadow-xl backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={() => removeToast(id)}
          className="shrink-0 text-slate-500 hover:text-slate-300"
          aria-label="Закрити"
        >
          ✕
        </button>
      </div>
    </motion.div>
  )
}

export function ToastStack() {
  const toasts = useEnergyStore((s) => s.toasts)

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[220] flex max-w-[min(100vw-2rem,20rem)] flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} id={t.id} message={t.message} />
        ))}
      </AnimatePresence>
    </div>
  )
}
