import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ResponsiveLayout from './layouts/ResponsiveLayout'
import Navigation from './components/Navigation'
import Login from './pages/Login'
import Register from './pages/Register'
import Maps from './pages/Maps'
import Data from './pages/Data'
import LoadingSpinner from './components/LoadingSpinner'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner size="lg" className="h-screen" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ResponsiveLayout>
            <Navigation />
            <main className="pt-16">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/maps"
                  element={
                    <ProtectedRoute>
                      <Maps />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/data"
                  element={
                    <ProtectedRoute>
                      <Data />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/maps" replace />} />
              </Routes>
            </main>
          </ResponsiveLayout>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
