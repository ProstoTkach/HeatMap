import * as turf from '@turf/turf'
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import type { DistrictStatic } from '../types/district'
import kharkivRaw from '../data/kharkiv-boundaries.json'

const VIEW_W = 1000
/** Розтягуємо по вертикалі (географічний bbox виглядає «сплюснутим» у широкому SVG). */
const VERTICAL_STRETCH = 1.32

type BBox = [number, number, number, number]

function padBbox(bbox: BBox, ratio: number): BBox {
  const [minX, minY, maxX, maxY] = bbox
  const dx = (maxX - minX) * ratio
  const dy = (maxY - minY) * ratio
  return [minX - dx, minY - dy, maxX + dx, maxY + dy]
}

function makeProject(bbox: BBox, width: number, height: number) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const dLon = maxLon - minLon
  const dLat = maxLat - minLat
  return (lon: number, lat: number): readonly [number, number] => {
    const x = ((lon - minLon) / dLon) * width
    const y = height - ((lat - minLat) / dLat) * height
    return [x, y] as const
  }
}

function ringsToPath(
  rings: number[][][],
  project: (lon: number, lat: number) => readonly [number, number],
): string {
  let d = ''
  for (const ring of rings) {
    if (ring.length < 3) continue
    const [x0, y0] = project(ring[0][0], ring[0][1])
    d += `M ${x0} ${y0}`
    for (let i = 1; i < ring.length; i++) {
      const [x, y] = project(ring[i][0], ring[i][1])
      d += ` L ${x} ${y}`
    }
    d += ' Z '
  }
  return d.trim()
}

function geometryToPath(
  geom: Polygon | MultiPolygon,
  project: (lon: number, lat: number) => readonly [number, number],
): string {
  if (geom.type === 'Polygon') {
    return ringsToPath(geom.coordinates, project)
  }
  return geom.coordinates.map((poly) => ringsToPath(poly, project)).join(' ')
}

function waterPath(project: (lon: number, lat: number) => readonly [number, number]): string {
  try {
    const river = turf.lineString([
      [36.14, 49.98],
      [36.2, 50.0],
      [36.26, 50.03],
      [36.32, 50.05],
      [36.38, 50.07],
    ])
    const buf = turf.buffer(river, 0.35, { units: 'kilometers' })
    const g = buf?.geometry
    if (!g || (g.type !== 'Polygon' && g.type !== 'MultiPolygon')) return ''
    return geometryToPath(g, project)
  } catch {
    return ''
  }
}

export interface KharkivMapModel {
  districts: DistrictStatic[]
  districtById: Record<string, DistrictStatic>
  viewBox: string
  width: number
  height: number
  project: (lon: number, lat: number) => readonly [number, number]
  waterPath: string
}

export function buildKharkivDistricts(): KharkivMapModel {
  const fc = kharkivRaw as unknown as FeatureCollection
  const raw = fc.features.filter((f) => f.geometry && f.geometry.type !== 'Point')
  const bb = turf.bbox(fc)
  const bbox = padBbox([bb[0], bb[1], bb[2], bb[3]] as BBox, 0.04)
  const [minLon, minLat, maxLon, maxLat] = bbox
  const dLon = maxLon - minLon
  const dLat = maxLat - minLat
  const height = VIEW_W * (dLat / dLon) * VERTICAL_STRETCH
  const project = makeProject(bbox, VIEW_W, height)

  const districts: DistrictStatic[] = raw.map((f, i) => {
    const id = String(i + 1)
    const props = f.properties as Record<string, string | undefined>
    const rawName = props['name:uk'] || props.name || `Кластер ${id}`
    const name = rawName
    const geom = f.geometry as Polygon | MultiPolygon
    const path = geometryToPath(geom, project)
    const c = turf.centroid(turf.feature(geom, f.properties))
    const [lon, lat] = c.geometry.coordinates
    const [lx, ly] = project(lon, lat)
    return {
      id,
      name,
      neighbors: [] as string[],
      path,
      label: { x: lx, y: ly },
      labelOffset: { dx: 0, dy: 0 },
    }
  })

  const neighbors: Record<string, string[]> = {}
  for (const d of districts) neighbors[d.id] = []

  for (let i = 0; i < districts.length; i++) {
    for (let j = i + 1; j < districts.length; j++) {
      const gi = raw[i].geometry as Polygon | MultiPolygon
      const gj = raw[j].geometry as Polygon | MultiPolygon
      const fi = turf.feature(gi)
      const fj = turf.feature(gj)
      if (turf.booleanTouches(fi, fj)) {
        const a = districts[i].id
        const b = districts[j].id
        neighbors[a].push(b)
        neighbors[b].push(a)
      }
    }
  }

  for (const d of districts) {
    d.neighbors = neighbors[d.id] ?? []
  }

  const districtById = Object.fromEntries(districts.map((d) => [d.id, d]))

  return {
    districts,
    districtById,
    viewBox: `0 0 ${VIEW_W} ${height}`,
    width: VIEW_W,
    height,
    project,
    waterPath: waterPath(project),
  }
}
