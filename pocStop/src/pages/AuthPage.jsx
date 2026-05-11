import { useState } from 'react'
import { pageStyles, cardStyles, tabBarStyles, tabStyles, formBodyStyles } from '../components/auth/authStyles'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'

export const AuthPage = () => {
  const [tab, setTab] = useState('login')
  return (
    <>
      <div css={pageStyles}>
        <div css={cardStyles}>
          <div css={tabBarStyles}>
            <button css={tabStyles(tab === 'login')} onClick={() => setTab('login')}>
              Entrar
            </button>
            <button css={tabStyles(tab === 'cadastro')} onClick={() => setTab('cadastro')}>
              Criar conta
            </button>
          </div>
          <div css={formBodyStyles}>
            {tab === 'login' ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </>
  )
}
