import { useEnergyStore } from '../../store/useEnergyStore'
import { GuidedTour, type TourStep } from './GuidedTour'

const MAP_TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="map-stage"]',
    title: 'Карта міста',
    body: 'Дев’ять адміністративних районів міста (межі з OSM). Темна маса блоків, тонкі сірі лінії — вулична сітка, блакитне — вода (спрощено). Зверху — шар стану теплових хабів.',
    cardPosition: 'bottom',
  },
  {
    selector: '[data-tour="legend"]',
    title: 'Стан кластера',
    body: 'Зелений — стабільно. Жовтий — висока нагрузка. Червоний — проблема або атака; сусідні райони отримують додатковий потік.',
    cardPosition: 'center',
    scrollToSelector: '[data-tour="legend"]',
  },
  {
    selector: '[data-tour="map-ministats"]',
    title: 'Живі показники',
    body: 'Нагрузка %, температура мережі, виробництво та статус оновлюються кожні ~1,6 с із симуляції.',
    cardPosition: 'bottom',
    scrollToSelector: '[data-tour="map-ministats"]',
  },
  {
    selector: '[data-tour="map-stage"]',
    title: 'Heat Hub',
    body: 'Децентралізовані вузли балансують тепломережу: локальні джерела, резерв і взаємодопомога між районами в реальному часі.',
    cardPosition: 'center',
  },
]

export function MapTour() {
  const done = useEnergyStore((s) => s.onboardingDone)
  const stepIndex = useEnergyStore((s) => s.onboardingStep)
  const setStep = useEnergyStore((s) => s.setOnboardingStep)
  const complete = useEnergyStore((s) => s.completeOnboarding)

  if (done) return null

  return (
    <GuidedTour
      open={!done}
      steps={MAP_TOUR_STEPS}
      stepIndex={stepIndex}
      onNext={() => setStep(stepIndex + 1)}
      onBack={() => setStep(Math.max(0, stepIndex - 1))}
      onClose={complete}
    />
  )
}
