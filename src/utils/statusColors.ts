import type { SystemStatus } from '../types/district'

export function statusFill(status: SystemStatus, load: number): string {
  if (status === 'problem') return 'rgba(244, 63, 94, 0.55)'
  if (status === 'high') {
    const t = Math.min(1, (load - 60) / 35)
    return `rgba(${234 - t * 40}, ${179 - t * 80}, ${8 + t * 30}, ${0.45 + t * 0.15})`
  }
  const t = load / 85
  return `rgba(${34 + t * 80}, ${197 - t * 60}, ${94 - t * 40}, ${0.35 + t * 0.2})`
}

export function statusStroke(status: SystemStatus): string {
  if (status === 'problem') return '#fb7185'
  if (status === 'high') return '#fbbf24'
  return '#4ade80'
}
