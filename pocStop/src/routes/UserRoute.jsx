import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const UserRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
        <span>Carregando...</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />
  if (isAdmin) return <Navigate to="/" replace />

  return children
}
