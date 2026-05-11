import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { salvarDadosUsuario } from '../../services/api'
import {
  sectionTitleStyles, errorStyles, successStyles,
  codeInputStyles, resendStyles, buttonStyles,
} from './authStyles'

const ERROR_MSGS = {
  CodeMismatchException:          'Código incorreto. Verifique e tente novamente.',
  ExpiredCodeException:           'Código expirado. Solicite um novo abaixo.',
  LimitExceededException:         'Muitas tentativas. Aguarde alguns minutos e solicite um novo código.',
  TooManyFailedAttemptsException: 'Muitas tentativas incorretas. Solicite um novo código abaixo.',
  UserNotFoundException:          'Conta não encontrada. O cadastro pode ter expirado. Volte e faça o cadastro novamente.',
}

// Erros onde temos certeza que o usuário NÃO foi confirmado no Cognito
const DEFINITE_FAILURES = new Set([
  'CodeMismatchException',
  'ExpiredCodeException',
  'UserNotFoundException',
  'LimitExceededException',
  'TooManyFailedAttemptsException',
])

const MAX_SAVE_RETRIES = 3
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export const ConfirmForm = ({ email, userId, dadosDemograficos, onBack }) => {
  const { confirm, resendCode } = useAuth()
  const [digits, setDigits]             = useState(['', '', '', '', '', ''])
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState(false)
  const [loading, setLoading]           = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [saveError, setSaveError]       = useState(false)
  const [resolvedUserId, setResolvedUserId] = useState(userId)

  const code = digits.join('')

  const clearDigits = () => {
    setDigits(['', '', '', '', '', ''])
    setTimeout(() => document.getElementById('code-0')?.focus(), 0)
  }

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

  const startCooldown = () => {
    setResendCooldown(60)
    const timer = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(timer); return 0 }
        return c - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    try {
      await resendCode(email)
      clearDigits()
      setError('')
      setFailedAttempts(0)
      startCooldown()
    } catch {
      setError('Erro ao reenviar o código. Tente novamente.')
    }
  }

  const trySave = async (uid) => {
    for (let attempt = 1; attempt <= MAX_SAVE_RETRIES; attempt++) {
      try {
        await salvarDadosUsuario({ userId: uid, ...dadosDemograficos })
        return true
      } catch {
        if (attempt < MAX_SAVE_RETRIES) await sleep(1000 * attempt)
      }
    }
    return false
  }

  const handleRetrySave = async () => {
    setLoading(true)
    setSaveError(false)
    const saved = await trySave(resolvedUserId)
    setLoading(false)
    if (saved) setSuccess(true)
    else setSaveError(true)
  }

  // Tenta confirmar o código. Retorna o userId retornado pelo Cognito (fallback caso o prop seja undefined).
  // NotAuthorizedException = usuário já estava confirmado — conta válida, segue para salvar.
  const tryConfirm = async () => {
    try {
      const res = await confirm(email, code)
      return res?.userId ?? null
    } catch (err) {
      if (err.name === 'NotAuthorizedException') return null
      throw err
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (code.length < 6) return setError('Digite os 6 dígitos do código.')
    setError('')
    setLoading(true)

    try {
      let confirmedUserId
      try {
        confirmedUserId = await tryConfirm()
      } catch (err) {
        if (DEFINITE_FAILURES.has(err.name)) throw err
        // Erro de rede ou desconhecido: o Cognito pode ter confirmado o usuário mas
        // a resposta não chegou ao cliente. Tenta novamente para descobrir.
        confirmedUserId = await tryConfirm()
      }

      // Usa o userId do prop; se estiver indefinido, usa o retornado pelo Cognito no confirm
      const uid = userId || confirmedUserId
      setResolvedUserId(uid)

      const saved = await trySave(uid)
      if (saved) setSuccess(true)
      else setSaveError(true)
    } catch (err) {
      setError(ERROR_MSGS[err.name] || err.message || 'Erro ao confirmar. Tente novamente.')
      setFailedAttempts((n) => n + 1)
      clearDigits()
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

  if (saveError) {
    return (
      <div>
        <div css={errorStyles} style={{ marginBottom: 16 }}>
          Seu e-mail foi confirmado, mas ocorreu um erro ao salvar seus dados.
        </div>
        <p style={{ fontSize: 13, color: '#5A7A80', marginBottom: 4, textAlign: 'center' }}>
          Sua conta foi criada. Clique abaixo para tentar novamente.
        </p>
        <button css={buttonStyles} onClick={handleRetrySave} disabled={loading}>
          {loading ? 'Salvando...' : 'Tentar novamente'}
        </button>
      </div>
    )
  }

  const suggestResend = failedAttempts >= 2

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
      <div css={resendStyles} style={suggestResend ? { fontWeight: 500, color: '#3AAFA9' } : {}}>
        {suggestResend ? 'Problemas com o código? ' : 'Não recebeu? '}
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
