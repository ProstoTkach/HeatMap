/**
 * Ручне зміщення підпису + міні-статистики відносно центроїду (у координатах SVG viewBox).
 * Змінюйте dx / dy для кожного id за потреби.
 */
export const DISTRICT_LABEL_OFFSETS: Record<string, { dx: number; dy: number }> = {
  '1': { dx: 0, dy: -30 },
  '2': { dx: 0, dy: -10 },
  '3': { dx: 0, dy: -20 },
  '4': { dx: 0, dy: 60 },
  '5': { dx: 20, dy: -50 },
  '6': { dx: 0, dy: 0 },
  '7': { dx: 130, dy: -60 },
  '8': { dx: 20, dy: -90 },
  '9': { dx: 50, dy: 50 },
}
