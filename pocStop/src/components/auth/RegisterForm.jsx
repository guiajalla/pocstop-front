import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  sectionTitleStyles, fieldStyles, rowStyles,
  buttonStyles, errorStyles, passwordRulesStyles, ruleStyles,
} from './authStyles'
import { PasswordInput } from './PasswordInput'
import { ConfirmForm } from './ConfirmForm'
import { GENEROS, ORIENTACOES, checkPassword } from './authConstants'

const ERROR_MSGS = {
  UsernameExistsException:   'Este e-mail já está cadastrado.',
  InvalidPasswordException:  'A senha não atende aos requisitos de segurança.',
  InvalidParameterException: 'Verifique os dados informados.',
}

const INITIAL_FORM = {
  nome: '', email: '', password: '', confirmPassword: '',
  dataNascimento: '', cidade: '', genero: '', orientacaoSexual: '',
}

export const RegisterForm = () => {
  const { register } = useAuth()
  const [form, setForm] = useState(INITIAL_FORM)
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
      setError(ERROR_MSGS[err.name] || err.message || 'Erro ao cadastrar. Tente novamente.')
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
