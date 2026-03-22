import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }

export function Home() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <motion.section
        className="text-center"
        {...fade}
        transition={{ duration: 0.55 }}
      >
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Стійкі теплові хаби Харкова
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Теплова інфраструктура, яка продовжує працювати навіть у складних умовах
        </p>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500">
          Інтерактивна демонстрація децентралізованої моделі: місцеві вузли, резерв і прозорий моніторинг без
          зайвої драматизації — для розуміння, як мережа може тримати стабільність у місті.
        </p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <Link
            to="/map"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-10 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
          >
            Перейти до карти
          </Link>
        </motion.div>
      </motion.section>

      <motion.section
        className="mt-20"
        {...fade}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h2 className="text-center text-3xl font-medium uppercase tracking-[0.2em] text-slate-500">
          Проблема
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            'Централізовані системи мають єдині точки відмови',
            'Один збій може вплинути на цілий район',
            'Критична інфраструктура потребує стабільності',
          ].map((t) => (
            <div
              key={t}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-slate-300 backdrop-blur-sm"
            >
              {t}
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mt-20"
        {...fade}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <h2 className="text-center text-3xl font-medium uppercase tracking-[0.2em] text-slate-500">
          Рішення
        </h2>
        <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-8 backdrop-blur-xl">
          <ul className="mx-auto max-w-md space-y-2 text-center text-slate-300">
            <li>15 незалежних кластерів (цільова топологія)</li>
            <li>≈25 МВт номіналу на кластер</li>
            <li>Автономна робота вузлів і взаємна підтримка</li>
          </ul>
            <img src='public/heatmap.jpg' className='w-full pt-2 max-w-140 mx-auto'></img>
          <p className="mt-4 text-center text-xs text-slate-500">
            На демо-карті — 9 міських адмінкластерів Харкова; концепція масштабується до повної сітки вузлів.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="mt-20"
        {...fade}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-center text-3xl font-medium uppercase tracking-[0.2em] text-slate-500">
          Що таке Heat Hub
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              t: 'Теплові насоси',
              d: 'Основне джерело тепла. Використовують електроенергію для переносу тепла з високою ефективністю.',
            },
            {
              t: 'Резервна генерація',
              d: 'Додаткові котли для пікових навантажень та аварійних ситуацій.',
            },
            {
              t: 'Теплові акумулятори',
              d: 'Зберігають тепло та забезпечують автономну роботу системи протягом кількох годин.',
            },
            {
              t: 'Енергетична незалежність',
              d: 'Кожен кластер може працювати окремо, зменшуючи ризик відключень.',
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md"
            >
              <h3 className="font-medium text-cyan-200/95">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.d}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mt-20"
        {...fade}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <h2 className="text-center text-3xl font-medium uppercase tracking-[0.2em] text-slate-500">
          SMART-система
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          Система дозволяє бачити стан тепломережі в реальному часі
        </p>
        <ul className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
          {['навантаження', 'температура', 'стан районів', 'ефективність'].map((x) => (
            <li key={x} className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
              {x}
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        className="mt-20 pb-8 text-center"
        {...fade}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Link
          to="/map"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-10 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
        >
          Відкрити карту
        </Link>
        <p className="mt-4 text-sm text-slate-500">Переглянути систему в реальному часі</p>
      </motion.section>
    </div>
  )
}
