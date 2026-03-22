import { useState } from 'react'
import { GuidedTour, type TourStep } from './GuidedTour'

const STORAGE_KEY = 'kharkiv-heat-hub-district-tour'

const STEPS: TourStep[] = [
  {
    selector: '[data-tour="district-metrics"]',
    title: 'Показники кластера',
    body: 'Номінальна потужність, поточна нагрузка, температура мережі, виробництво та оцінка CO₂-економії — усе оновлюється разом із симуляцією.',
    cardPosition: 'bottom',
    scrollToSelector: '[data-tour="district-metrics"]',
  },
  {
    selector: '[data-tour="district-charts"]',
    title: 'Графіки',
    body: 'Історія нагрузки, температури, виробництва та стабільності — криві ростуть у реальному часі разом із тікером мережі.',
    cardPosition: 'top',
    scrollToSelector: '[data-tour="district-charts"]',
  },
  {
    selector: '[data-tour="district-chart-load"]',
    title: 'Нагрузка в динаміці',
    body: 'Перший графік показує, як змінюється відсоток нагрузки — основний індикатор балансу хаба.',
    cardPosition: 'top',
    scrollToSelector: '[data-tour="district-chart-load"]',
  },
  {
    selector: '[data-tour="district-events"]',
    title: 'Журнал подій',
    body: 'Тут з’являються події симуляції: сплески, зниження, аварії та перерозподіл між сусідами. Нові рядки приходять із глобального рушія.',
    cardPosition: 'top',
    scrollToSelector: '[data-tour="district-events"]',
  },
]

function loadDone(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return true
  }
}

export function DistrictPanelTour() {
  const [done, setDone] = useState(loadDone)
  const [stepIndex, setStepIndex] = useState(0)

  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setDone(true)
  }

  if (done) return null

  return (
    <GuidedTour
      open
      steps={STEPS}
      stepIndex={stepIndex}
      onNext={() => setStepIndex((i) => i + 1)}
      onBack={() => setStepIndex((i) => Math.max(0, i - 1))}
      onClose={close}
    />
  )
}
