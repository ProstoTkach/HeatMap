import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export type TourCardPosition = 'top' | 'center' | 'bottom'

export type TourStep = {
  selector: string
  title: string
  body: string
  /** Положення картки підказки */
  cardPosition?: TourCardPosition
  /** Плавний скрол до елемента (наприклад, графіки на мобільному) */
  scrollToSelector?: string
}

type Props = {
  steps: TourStep[]
  stepIndex: number
  open: boolean
  onNext: () => void
  onBack: () => void
  onClose: () => void
}

const CARD_POS: Record<TourCardPosition, string> = {
  top: 'top-[max(0.75rem,3vh)] left-1/2 -translate-x-1/2',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  bottom: 'bottom-[max(0.75rem,5vh)] left-1/2 -translate-x-1/2',
}

export function GuidedTour({ steps, stepIndex, open, onNext, onBack, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [line, setLine] = useState<{
    x1: number
    y1: number
    x2: number
    y2: number
  } | null>(null)
  const [layoutTick, setLayoutTick] = useState(0)

  const step = steps[Math.min(stepIndex, steps.length - 1)]
  const isLast = stepIndex >= steps.length - 1
  const pos: TourCardPosition = step.cardPosition ?? 'center'

  useEffect(() => {
    if (!open || !step.scrollToSelector) return
    const t = window.setTimeout(() => {
      document.querySelector(step.scrollToSelector!)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 120)
    return () => window.clearTimeout(t)
  }, [open, stepIndex, step.scrollToSelector])

  useLayoutEffect(() => {
    if (!open || !step) return

    const raf = requestAnimationFrame(() => {
      const targetEl = document.querySelector(step.selector) as HTMLElement | null
      const card = cardRef.current
      if (!card) {
        setLine(null)
        return
      }
      const c = card.getBoundingClientRect()
      if (targetEl) {
        targetEl.classList.add('tour-spotlight')
        const t = targetEl.getBoundingClientRect()
        const ccx = c.left + c.width / 2
        const ccy = c.top + c.height / 2
        const tcx = t.left + t.width / 2
        const tcy = t.top + t.height / 2
        setLine({ x1: ccx, y1: ccy, x2: tcx, y2: tcy })
      } else {
        setLine(null)
      }
    })

    return () => {
      cancelAnimationFrame(raf)
      const el = document.querySelector(step.selector) as HTMLElement | null
      el?.classList.remove('tour-spotlight')
    }
  }, [open, step, stepIndex, layoutTick])

  useLayoutEffect(() => {
    if (!open) return
    const bump = () => {
      requestAnimationFrame(() => setLayoutTick((n) => n + 1))
    }
    window.addEventListener('resize', bump)
    window.addEventListener('scroll', bump, true)
    return () => {
      window.removeEventListener('resize', bump)
      window.removeEventListener('scroll', bump, true)
    }
  }, [open])

  if (!open || steps.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[140]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {line && (
          <svg className="absolute inset-0 size-full" aria-hidden>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(34, 211, 238, 0.55)"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            <circle cx={line.x2} cy={line.y2} r={5} fill="rgba(34, 211, 238, 0.9)" />
          </svg>
        )}
        <div
          ref={cardRef}
          className={`pointer-events-auto fixed z-[150] w-[min(100%-2rem,26rem)] ${CARD_POS[pos]}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
        >
          <motion.div
            className="rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-5 shadow-2xl shadow-cyan-950/50"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-cyan-400/90">
                Крок {stepIndex + 1} / {steps.length}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Закрити
              </button>
            </div>
            <h2 id="tour-title" className="text-lg font-semibold text-white">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
            <div className="mt-5 flex justify-end gap-2">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                >
                  Назад
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (isLast) onClose()
                  else onNext()
                }}
                className="rounded-lg bg-cyan-500/90 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
              >
                {isLast ? 'Готово' : 'Далі'}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
