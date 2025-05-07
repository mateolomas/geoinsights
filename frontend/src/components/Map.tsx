import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import { useEffect, useState } from 'react'
import api from '../services/api'
import LoadingSpinner from './LoadingSpinner'

// Fix for default marker icon
const icon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface GeoData {
  id: number
  name: string
  description: string
  geometry: {
    type: string
    coordinates: [number, number]
  }
  properties: Record<string, any>
}

export default function Map() {
  const [geoData, setGeoData] = useState<GeoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await api.get('/geo/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data) {
          console.log('Received geo data:', response.data)
          setGeoData(response.data)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching geo data:', err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Failed to load geographic data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGeoData()
  }, [])

  if (loading) {
    return <LoadingSpinner size="lg" className="h-[600px]" />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  // Calculate the center of the map based on the data points
  const center: [number, number] = geoData.length > 0
    ? [
        geoData.reduce((sum, point) => sum + point.geometry.coordinates[1], 0) / geoData.length,
        geoData.reduce((sum, point) => sum + point.geometry.coordinates[0], 0) / geoData.length,
      ]
    : [0, 0]

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoData.map((data) => {
          console.log('Rendering marker:', data)
          return (
            <Marker
              key={data.id}
              position={[data.geometry.coordinates[1], data.geometry.coordinates[0]]}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{data.name}</h3>
                  <p className="text-gray-600">{data.description}</p>
                  {data.properties && Object.entries(data.properties).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-500">
                      <span className="font-medium">{key}:</span> {value}
                    </p>
                  ))}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
} 