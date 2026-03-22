import { useEffect } from 'react'
import { useEnergyStore } from '../../store/useEnergyStore'

export function SimulationBoot() {
  useEffect(() => {
    useEnergyStore.getState().startSimulation()
    return () => useEnergyStore.getState().stopSimulation()
  }, [])

  useEffect(() => {
    const t5 = window.setTimeout(() => {
      const at = Date.now()
      useEnergyStore.setState((s) => ({
        events: [
          {
            id: `scripted-${at}`,
            districtId: '1',
            message:
              'Сценарій: короткий сплеск нагрузки в Шевченківському кластері (демонстрація журналу)',
            at,
          },
          ...s.events,
        ].slice(0, 80),
      }))
    }, 5000)

    const t8 = window.setTimeout(() => {
      useEnergyStore.getState().pushToast(
        'Подія з’явилась у стрічці мережі. На сторінці району в блоці «Події» — такі ж записи в реальному часі.',
      )
    }, 8000)

    return () => {
      window.clearTimeout(t5)
      window.clearTimeout(t8)
    }
  }, [])

  return null
}
