# Стійкі теплові хаби Харкова — демо

React + Vite + TypeScript + Tailwind + Zustand + Recharts + Framer Motion. Дані симульовані в браузері.

## Команди

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Vercel

Імпортуй репозиторій або виконай `vercel` у корені. У проєкті є `vercel.json` з SPA rewrite.

Межі районів: `src/data/kharkiv-boundaries.json` (імпорт як JSON; вихідний GeoJSON можна тримати з тим самим вмістом).

Щоб скинути онбординг карти: видали `kharkiv-heat-hub-onboarding`. Окремо: тур панелі району — `kharkiv-heat-hub-district-tour`.
