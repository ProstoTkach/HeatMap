export type SystemStatus = 'stable' | 'high' | 'problem'

export interface DistrictStatic {
  id: string
  name: string
  neighbors: string[]
  path: string
  label: { x: number; y: number }
  /** Зміщення підпису та міні-панелі (див. districtLabelOffsets.ts) */
  labelOffset: { dx: number; dy: number }
}

export interface HistoryPoint {
  t: number
  v: number
}

export interface DistrictRuntime {
  loadPct: number
  networkTempC: number
  productionMW: number
  stability: number
  co2SavedKgPerH: number
  status: SystemStatus
  incidentUntil: number
  neighborBoostUntil: number
  loadHistory: HistoryPoint[]
  tempHistory: HistoryPoint[]
  prodHistory: HistoryPoint[]
  stabilityHistory: HistoryPoint[]
}

export interface NetworkEvent {
  id: string
  districtId: string
  message: string
  at: number
}
