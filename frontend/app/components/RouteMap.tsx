'use client'

import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface Marker {
  sequence: number
  name: string
  type: string
  coordinates: { lat: number; lon: number }
  category?: string
  scientific_explanation?: string
  observation_tips?: string
}

interface RouteMapProps {
  routeCoordinates?: Array<{ lat: number; lon: number }>
  markers?: Marker[]
  isRoundTrip?: boolean
  // Legacy props for backwards compatibility
  fuelStops?: Array<{
    location: string
    coordinates?: { lat: number; lon: number }
  }>
  accommodationPoints?: Array<{
    name: string
    coordinates?: { lat: number; lon: number }
  }>
  sciencePoints?: Array<{
    name: string
    coordinates?: { lat: number; lon: number }
  }>
}

// Component to auto-fit map bounds
function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap()

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [bounds, map])

  return null
}

export default function RouteMap({
  routeCoordinates = [],
  markers = [],
  isRoundTrip = false,
  fuelStops = [],
  accommodationPoints = [],
  sciencePoints = []
}: RouteMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-carbon-light rounded-lg flex items-center justify-center">
        <p className="text-off-white/50">加载地图中...</p>
      </div>
    )
  }

  // Create numbered and colored icon by type
  const createNumberedIcon = (sequence: number, type: string) => {
    const colorMap: { [key: string]: string } = {
      'fuel': '#FF6B6B',           // Red
      'accommodation': '#4ECDC4',  // Cyan
      'science_point': '#45B7D1',  // Blue
      'viewpoint': '#FFA07A',      // Orange
      'scenic_spot': '#98D8C8',    // Green
      'trailhead': '#9B59B6',      // Purple
    }

    const color = colorMap[type] || '#3A7A35' // Default forest green

    return L.divIcon({
      className: 'custom-numbered-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          color: white;
        ">
          ${sequence}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })
  }

  // Type icons mapping
  const typeIconMap: { [key: string]: string } = {
    'fuel': '⛽',
    'accommodation': '🏨',
    'science_point': '🔬',
    'viewpoint': '📷',
    'scenic_spot': '🏔️',
    'trailhead': '🥾',
  }

  // Sort markers by sequence
  const sortedMarkers = [...markers].sort((a, b) => a.sequence - b.sequence)

  // Prepare route path
  let routePath: [number, number][] = []
  if (routeCoordinates && routeCoordinates.length > 0) {
    routePath = routeCoordinates.map(coord => [coord.lat, coord.lon])
  } else {
    // Fallback: use marker coordinates
    routePath = sortedMarkers.map(m => [m.coordinates.lat, m.coordinates.lon])
  }

  // Calculate bounds for auto-fitting
  const allCoords = routePath.length > 0 ? routePath :
    sortedMarkers.map(m => [m.coordinates.lat, m.coordinates.lon])

  const bounds = allCoords.length > 0
    ? L.latLngBounds(allCoords as [number, number][])
    : null

  const center: [number, number] = allCoords.length > 0
    ? [
        allCoords.reduce((sum, p) => sum + p[0], 0) / allCoords.length,
        allCoords.reduce((sum, p) => sum + p[1], 0) / allCoords.length,
      ]
    : [44.0, -120.5] // Default to Oregon

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-carbon-light">
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto-fit bounds */}
        {bounds && <FitBounds bounds={bounds} />}

        {/* Route Path */}
        {routePath.length > 1 && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: isRoundTrip ? '#0066CC' : '#2D5A27', // Blue for round trip, green for one-way
              weight: 4,
              opacity: 0.8,
              dashArray: isRoundTrip ? '10, 10' : undefined // Dashed line for round trip
            }}
          />
        )}

        {/* Markers */}
        {sortedMarkers.map((marker, index) => (
          <Marker
            key={`marker-${marker.sequence}-${index}`}
            position={[marker.coordinates.lat, marker.coordinates.lon]}
            icon={createNumberedIcon(marker.sequence, marker.type)}
          >
            <Popup>
              <div className="text-sm max-w-xs">
                <p className="font-bold text-base mb-1">
                  {typeIconMap[marker.type] || '📍'} {marker.name}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  站点 #{marker.sequence} · {marker.type}
                </p>
                {marker.scientific_explanation && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="font-semibold text-xs text-blue-600">科学解释:</p>
                    <p className="text-xs mt-1">{marker.scientific_explanation}</p>
                  </div>
                )}
                {marker.observation_tips && (
                  <div className="mt-2">
                    <p className="font-semibold text-xs text-green-600">观测技巧:</p>
                    <p className="text-xs mt-1">{marker.observation_tips}</p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Legacy markers (backwards compatibility) */}
        {fuelStops.filter(s => s.coordinates).map((stop, index) => (
          <Marker
            key={`fuel-${index}`}
            position={[stop.coordinates!.lat, stop.coordinates!.lon]}
            icon={createNumberedIcon(index + 1, 'fuel')}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-red-600">⛽ 加油站</p>
                <p>{stop.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
