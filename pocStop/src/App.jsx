import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AdminEstabelecimentosPage } from './pages/EstablishmentsAdmin'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { Content } from './components/content'
import { AuthPage } from './pages/AuthPage'
import { AdminRoute } from './routes/AdminRoute'
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
            <Route path="/" element={<Content />} />
            <Route path="/auth" element={<AuthPage />} />

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