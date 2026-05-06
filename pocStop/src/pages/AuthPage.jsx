import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { salvarDadosUsuario } from '../services/api'
import { css, Global } from '@emotion/react'

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --radius: 6px; --error: #c0392b; --success: #2e7d32; }
`

const pageStyles = css`
  min-height: 100vh;
  background-color: #f4faf4;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 24px 80px;
  font-family: 'DM Sans', sans-serif;
`

const cardStyles = css`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 5px 1rem lightblue;
  overflow: hidden;
`

const tabBarStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: PaleGreen;
`

const tabStyles = (active) => css`
  padding: 16px;
  border: none;
  background: ${active ? 'white' : 'transparent'};
  color: ${active ? '#2e7d32' : '#4a6e4a'};
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: ${active ? '600' : '400'};
  cursor: pointer;
  border-bottom: ${active ? '2px solid #4caf50' : '2px solid transparent'};
  transition: all 0.2s;
  &:hover { background: ${active ? 'white' : 'rgba(255,255,255,0.5)'}; }
`

const formBodyStyles = css`padding: 32px;`

const sectionTitleStyles = css`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4caf50;
  margin: 24px 0 14px;
  padding-bottom: 6px;
  border-bottom: 1px solid #c8e6c9;
  &:first-of-type { margin-top: 0; }
`

const fieldStyles = css`
  margin-bottom: 14px;
  label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6a8f6a;
    margin-bottom: 6px;
  }
  input, select {
    width: 100%;
    background: #f4faf4;
    border: 1px solid #c8e6c9;
    border-radius: var(--radius);
    padding: 10px 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1b2e1b;
    outline: none;
    appearance: none;
    transition: border-color 0.2s;
    &:focus { border-color: #4caf50; background: white; }
    &::placeholder { color: #a5c8a5; }
    option { background: white; }
  }
`

const passwordWrapStyles = css`
  position: relative;
  input { padding-right: 42px; }
`

const eyeBtnStyles = css`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6a8f6a;
  font-size: 16px;
  padding: 2px;
  line-height: 1;
  &:hover { color: #2e7d32; }
`

const rowStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`

const buttonStyles = css`
  width: 100%;
  background: PaleGreen;
  color: #1b2e1b;
  border: none;
  border-radius: var(--radius);
  padding: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 0px 3px 8px lightblue;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

const errorStyles = css`
  background: rgba(192, 57, 43, 0.08);
  border: 1px solid rgba(192, 57, 43, 0.25);
  border-radius: var(--radius);
  padding: 10px 13px;
  font-size: 13px;
  color: var(--error);
  margin-bottom: 16px;
`

const successStyles = css`
  background: rgba(46, 125, 50, 0.08);
  border: 1px solid rgba(46, 125, 50, 0.25);
  border-radius: var(--radius);
  padding: 16px;
  font-size: 14px;
  color: var(--success);
  text-align: center;
  line-height: 1.7;
`

const passwordRulesStyles = css`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ruleStyles = (ok) => css`
  font-size: 11px;
  color: ${ok ? '#2e7d32' : '#9e9e9e'};
  display: flex;
  align-items: center;
  gap: 5px;
  &::before { content: "${ok ? '✓' : '○'}"; font-weight: 700; }
`

const codeInputStyles = css`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 24px 0 8px;
  input {
    width: 48px;
    height: 56px;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    background: #f4faf4;
    border: 1px solid #c8e6c9;
    border-radius: var(--radius);
    color: #1b2e1b;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s;
    &:focus { border-color: #4caf50; background: white; }
  }
`

const resendStyles = css`
  text-align: center;
  font-size: 12px;
  color: #6a8f6a;
  margin-top: 12px;
  button {
    background: none;
    border: none;
    color: #4caf50;
    font-size: 12px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    padding: 0;
    &:hover { text-decoration: underline; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
`

const GENEROS = [
  'Homem cisgênero', 'Mulher cisgênero', 'Homem transgênero',
  'Mulher transgênero', 'Não-binário', 'Gênero fluido',
  'Agênero', 'Prefiro não informar', 'Outro',
]

const ORIENTACOES = [
  'Heterossexual', 'Gay', 'Lésbica', 'Bissexual',
  'Pansexual', 'Assexual', 'Prefiro não informar', 'Outro',
]

const checkPassword = (pwd) => ({
  length:  pwd.length >= 8,
  upper:   /[A-Z]/.test(pwd),
  lower:   /[a-z]/.test(pwd),
  number:  /[0-9]/.test(pwd),
  special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
})

// ─── PasswordInput ────────────────────────────────────────────────────────────

const PasswordInput = ({ placeholder, value, onChange }) => {
  const [show, setShow] = useState(false)
  return (
    <div css={passwordWrapStyles}>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <button type="button" css={eyeBtnStyles} onClick={() => setShow((s) => !s)}>
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────

const LoginForm = () => {
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
      const msgs = {
        NotAuthorizedException:    'E-mail ou senha incorretos.',
        UserNotFoundException:     'Usuário não encontrado.',
        UserNotConfirmedException: 'Confirme seu e-mail antes de entrar.',
      }
      setError(msgs[err.name] || err.message || 'Erro ao entrar. Tente novamente.')
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

// ─── Confirmação de código ────────────────────────────────────────────────────

const ConfirmForm = ({ email, password, userId, dadosDemograficos, onBack }) => {
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
    if (cleaned && i < 5) {
      document.getElementById(`code-${i + 1}`)?.focus()
    }
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
      const msgs = {
        CodeMismatchException:  'Código incorreto. Verifique e tente novamente.',
        ExpiredCodeException:   'Código expirado. Solicite um novo abaixo.',
        NotAuthorizedException: 'Usuário já confirmado. Tente fazer login.',
      }
      setError(msgs[err.name] || err.message || 'Erro ao confirmar. Tente novamente.')
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

// ─── Cadastro ─────────────────────────────────────────────────────────────────

const RegisterForm = () => {
  const { register } = useAuth()
  const [form, setForm] = useState({
    nome: '', email: '', password: '', confirmPassword: '',
    dataNascimento: '', cidade: '', genero: '', orientacaoSexual: '',
  })
  const [error, setError] = useState('')
  const [step, setStep] = useState('form')
  const [pendingUserId, setPendingUserId] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const rules = checkPassword(form.password)
  const allRulesOk = Object.values(rules).every(Boolean)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) return setError('As senhas não coincidem.')
    if (!allRulesOk) return setError('A senha não atende a todos os requisitos.')
    setLoading(true)
    try {
      const result = await register(form.email, form.password)
      setPendingUserId(result?.userId)
      setStep('confirm')
    } catch (err) {
      const msgs = {
        UsernameExistsException:   'Este e-mail já está cadastrado.',
        InvalidPasswordException:  'A senha não atende aos requisitos de segurança.',
        InvalidParameterException: 'Verifique os dados informados.',
      }
      setError(msgs[err.name] || err.message || 'Erro ao cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'confirm') {
    return (
      <ConfirmForm
        email={form.email}
        password={form.password}
        userId={pendingUserId}
        dadosDemograficos={{
          nome:             form.nome,
          dataNascimento:   form.dataNascimento,
          cidade:           form.cidade,
          genero:           form.genero,
          orientacaoSexual: form.orientacaoSexual,
        }}
        onBack={() => setStep('form')}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div css={errorStyles}>{error}</div>}

      <div css={sectionTitleStyles}>Dados de acesso</div>

      <div css={fieldStyles}>
        <label>Nome completo</label>
        <input type="text" placeholder="João Silva"
          value={form.nome} onChange={set('nome')} required />
      </div>
      <div css={fieldStyles}>
        <label>E-mail</label>
        <input type="email" placeholder="seu@email.com"
          value={form.email} onChange={set('email')} required />
      </div>

      <div css={rowStyles}>
        <div css={fieldStyles}>
          <label>Senha</label>
          <PasswordInput
            placeholder="Crie uma senha"
            value={form.password}
            onChange={set('password')}
          />
          {form.password.length > 0 && (
            <div css={passwordRulesStyles}>
              <span css={ruleStyles(rules.length)}>Mínimo 8 caracteres</span>
              <span css={ruleStyles(rules.upper)}>1 letra maiúscula</span>
              <span css={ruleStyles(rules.lower)}>1 letra minúscula</span>
              <span css={ruleStyles(rules.number)}>1 número</span>
              <span css={ruleStyles(rules.special)}>1 caractere especial (!@#$...)</span>
            </div>
          )}
        </div>
        <div css={fieldStyles}>
          <label>Confirmar senha</label>
          <PasswordInput
            placeholder="Repita a senha"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
          />
          {form.confirmPassword.length > 0 && (
            <div css={passwordRulesStyles}>
              <span css={ruleStyles(form.password === form.confirmPassword)}>
                Senhas coincidem
              </span>
            </div>
          )}
        </div>
      </div>

      <div css={sectionTitleStyles}>Informações pessoais</div>

      <div css={rowStyles}>
        <div css={fieldStyles}>
          <label>Data de nascimento</label>
          <input type="date" value={form.dataNascimento}
            onChange={set('dataNascimento')} required />
        </div>
        <div css={fieldStyles}>
          <label>Cidade</label>
          <input type="text" placeholder="São Paulo"
            value={form.cidade} onChange={set('cidade')} required />
        </div>
      </div>
      <div css={rowStyles}>
        <div css={fieldStyles}>
          <label>Gênero</label>
          <select value={form.genero} onChange={set('genero')} required>
            <option value="">Selecione...</option>
            {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div css={fieldStyles}>
          <label>Orientação sexual</label>
          <select value={form.orientacaoSexual} onChange={set('orientacaoSexual')} required>
            <option value="">Selecione...</option>
            {ORIENTACOES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <button css={buttonStyles} type="submit" disabled={loading || !allRulesOk}>
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export const AuthPage = () => {
  const [tab, setTab] = useState('login')
  return (
    <>
      <Global styles={globalStyles} />
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