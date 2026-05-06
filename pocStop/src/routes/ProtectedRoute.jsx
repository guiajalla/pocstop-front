// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <span>Carregando...</span>
      </div>
    )
  }

  return user ? children : <Navigate to="/auth" replace />
}
