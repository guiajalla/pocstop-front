import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AdminEstabelecimentosPage } from './pages/EstablishmentsAdmin'
import { UserProfilePage } from './pages/UserProfilePage'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { HomePage } from './pages/HomePage'
import { AuthPage } from './pages/AuthPage'
import { AdminRoute } from './routes/AdminRoute'
import { UserRoute } from './routes/UserRoute'
import { css } from '@emotion/react'

const AppStyles = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
`

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div css={AppStyles}>
          <Header />
          <Routes>
            {/* Pública */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Perfil do usuário */}
            <Route
              path="/perfil"
              element={
                <UserRoute>
                  <UserProfilePage />
                </UserRoute>
              }
            />

            {/* Exclusiva admin */}
            <Route
              path="/admin/estabelecimentos"
              element={
                <AdminRoute>
                  <AdminEstabelecimentosPage />
                </AdminRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App