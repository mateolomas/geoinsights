import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh')
      const { access_token } = response.data
      if (!access_token) {
        console.error('No access token received during refresh')
        return false
      }
      localStorage.setItem('token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setIsAuthenticated(true)
      return true
    } catch (error: any) {
      console.error('Token refresh failed:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
      }
      return false
    }
  }

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        // Set the token in the API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Try to fetch user data to validate the token
        await api.get('/users/me')
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Token validation failed:', error)
        const refreshed = await refreshToken()
        if (!refreshed) {
          localStorage.removeItem('token')
          setIsAuthenticated(false)
          if (!location.pathname.startsWith('/login')) {
            navigate('/login', { state: { from: location.pathname } })
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    validateToken()
  }, [location.pathname, navigate])

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        username: username.trim(),
        password: password.trim()
      })
      const { access_token } = response.data
      if (!access_token) {
        throw new Error('No access token received from server')
      }
      localStorage.setItem('token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setIsAuthenticated(true)
      navigate('/maps')
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.response?.status === 401) {
        throw new Error('Invalid credentials')
      } else if (error.response?.status === 422) {
        const validationErrors = error.response.data
        const errorMessage = Array.isArray(validationErrors)
          ? validationErrors.map((err: any) => err.msg).join(', ')
          : 'Invalid credentials'
        throw new Error(errorMessage)
      } else if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again later')
      } else if (!error.response) {
        throw new Error('Network error. Please check your connection')
      }
      throw new Error('An unexpected error occurred. Please try again')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, refreshToken: async () => { await refreshToken(); } }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}