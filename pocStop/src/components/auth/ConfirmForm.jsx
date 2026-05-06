import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { salvarDadosUsuario } from '../../services/api'
import {
  sectionTitleStyles, errorStyles, successStyles,
  codeInputStyles, resendStyles, buttonStyles,
} from './authStyles'

const ERROR_MSGS = {
  CodeMismatchException:  'Código incorreto. Verifique e tente novamente.',
  ExpiredCodeException:   'Código expirado. Solicite um novo abaixo.',
  NotAuthorizedException: 'Usuário já confirmado. Tente fazer login.',
}

export const ConfirmForm = ({ email, password, userId, dadosDemograficos, onBack }) => {
  const { confirm, resendCode, rollbackRegister } = useAuth()
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const code = digits.join('')

  const handleDigit = (i, val) => {
    const cleaned = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = cleaned
    setDigits(next)
    if (cleaned && i < 5) document.getElementById(`code-${i + 1}`)?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      document.getElementById(`code-${i - 1}`)?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(''))
      document.getElementById('code-5')?.focus()
    }
  }

  const handleResend = async () => {
    try {
      await resendCode(email)
      setResendCooldown(60)
      const timer = setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) { clearInterval(timer); return 0 }
          return c - 1
        })
      }, 1000)
    } catch {
      setError('Erro ao reenviar o código. Tente novamente.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (code.length < 6) return setError('Digite os 6 dígitos do código.')
    setError('')
    setLoading(true)
    try {
      await confirm(email, code)
      try {
        await salvarDadosUsuario({ userId, ...dadosDemograficos })
      } catch {
        await rollbackRegister(email, password)
        throw new Error('Erro ao salvar seus dados. O cadastro foi cancelado. Tente novamente.')
      }
      setSuccess(true)
    } catch (err) {
      setError(ERROR_MSGS[err.name] || err.message || 'Erro ao confirmar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div css={successStyles}>
        ✓ E-mail confirmado com sucesso!<br />
        Sua conta está ativa. Agora você pode fazer login.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div css={sectionTitleStyles}>Confirme seu e-mail</div>
      <p style={{ fontSize: 13, color: '#6a8f6a', marginBottom: 4 }}>
        Enviamos um código de 6 dígitos para <strong>{email}</strong>
      </p>
      {error && <div css={errorStyles}>{error}</div>}
      <div css={codeInputStyles} onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            id={`code-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            autoFocus={i === 0}
            onChange={(e) => handleDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>
      <div css={resendStyles}>
        Não recebeu?{' '}
        <button type="button" onClick={handleResend} disabled={resendCooldown > 0}>
          {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código'}
        </button>
      </div>
      <button css={buttonStyles} type="submit" disabled={loading || code.length < 6}>
        {loading ? 'Confirmando...' : 'Confirmar'}
      </button>
      <button
        type="button"
        onClick={onBack}
        style={{
          width: '100%', background: 'none', border: 'none', marginTop: 12,
          fontSize: 12, color: '#6a8f6a', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        }}
      >
        ← Voltar ao cadastro
      </button>
    </form>
  )
}
