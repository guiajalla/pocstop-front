import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { sectionTitleStyles, fieldStyles, buttonStyles, errorStyles } from './authStyles'
import { PasswordInput } from './PasswordInput'

const ERROR_MSGS = {
  NotAuthorizedException:    'E-mail ou senha incorretos.',
  UserNotFoundException:     'Usuário não encontrado.',
  UserNotConfirmedException: 'Confirme seu e-mail antes de entrar.',
}

export const LoginForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(ERROR_MSGS[err.name] || err.message || 'Erro ao entrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div css={errorStyles}>{error}</div>}
      <div css={sectionTitleStyles}>Dados de acesso</div>
      <div css={fieldStyles}>
        <label>E-mail</label>
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div css={fieldStyles}>
        <label>Senha</label>
        <PasswordInput
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button css={buttonStyles} type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
