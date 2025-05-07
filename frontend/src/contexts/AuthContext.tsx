import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

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
        await api.get('/auth/me')
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Token validation failed:', error)
        localStorage.removeItem('token')
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    validateToken()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        username: username.trim(),
        password: password.trim()
      })
      const { access_token } = response.data
      localStorage.setItem('token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setIsAuthenticated(true)
      navigate('/maps')
    } catch (error: any) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data
        const errorMessage = Array.isArray(validationErrors)
          ? validationErrors.map((err: any) => err.msg).join(', ')
          : 'Invalid credentials'
        throw new Error(errorMessage)
      }
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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