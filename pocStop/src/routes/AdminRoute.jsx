// src/routes/AdminRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protege rotas exclusivas do admin.
 * - Não autenticado → redireciona para /auth
 * - Autenticado mas não admin → redireciona para / (acesso negado)
 */
export const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
        <span>Carregando...</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return children
}