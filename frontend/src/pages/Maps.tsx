import { useState, useEffect } from 'react'
import Map from '../components/Map'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Maps() {
  const [view, setView] = useState<'map' | 'list'>('map')
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login')
      } else {
        setLoading(false)
      }
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleViewChange = (newView: 'map' | 'list') => {
    setLoading(true)
    setView(newView)
    // Simulate loading state for view change
    setTimeout(() => setLoading(false), 500)
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" className="h-[600px]" />
  }

  if (!isAuthenticated) {
    return null // Will be redirected by the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Geographic Data</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => handleViewChange('map')}
            className={`px-4 py-2 rounded-lg ${
              view === 'map'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => handleViewChange('list')}
            className={`px-4 py-2 rounded-lg ${
              view === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" className="h-[600px]" />
      ) : view === 'map' ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Map />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600">List view coming soon...</p>
        </div>
      )}
    </div>
  )
}