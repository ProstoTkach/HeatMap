import { buildKharkivDistricts } from '../geo/buildKharkivDistricts'
import { DISTRICT_LABEL_OFFSETS } from './districtLabelOffsets'

export const CLUSTER_POWER_MW = 25

const model = buildKharkivDistricts()

export const DISTRICTS = model.districts.map((d) => ({
  ...d,
  labelOffset: DISTRICT_LABEL_OFFSETS[d.id] ?? { dx: 0, dy: 0 },
}))

export const districtById = Object.fromEntries(DISTRICTS.map((d) => [d.id, d]))
export const KHARKIV_VIEWBOX = model.viewBox
export const KHARKIV_WATER_PATH = model.waterPath
export const KHARKIV_MAP_HEIGHT = model.height
