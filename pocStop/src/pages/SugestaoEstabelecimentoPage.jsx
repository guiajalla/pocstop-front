import { useState } from 'react'
import { css } from '@emotion/react'
import { useAuth } from '../context/AuthContext'
import { sugerirEstabelecimento } from '../services/api'
import { ESTADOS_BR, CATEGORIAS } from '../components/establishments/establishmentConstants'

const pageStyles = css`
  min-height: 60vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 16px;
  background: #F3F8F8;
`

const cardStyles = css`
  background: white;
  border: 1px solid #C2DFE0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  padding: 36px 40px;
  width: 100%;
  max-width: 520px;
  @media (max-width: 600px) { padding: 24px 20px; }
`

const headingStyles = css`
  font-size: 22px;
  font-weight: 600;
  color: #1A3038;
  margin-bottom: 6px;
`

const subheadingStyles = css`
  font-size: 13px;
  color: #5A7A80;
  margin-bottom: 28px;
  line-height: 1.5;
`

const fieldGroupStyles = css`
  margin-bottom: 16px;
  label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #5A7A80;
    margin-bottom: 5px;
  }
  input, select {
    width: 100%;
    background: #F3F8F8;
    border: 1px solid #C2DFE0;
    border-radius: 6px;
    padding: 9px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #1A3038;
    outline: none;
    appearance: none;
    transition: border-color 0.15s;
    &:focus { border-color: #3AAFA9; background: white; }
    &::placeholder { color: #9ABFC2; }
    option { background: white; }
  }
`

const rowStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const submitBtnStyles = css`
  width: 100%;
  margin-top: 8px;
  padding: 11px;
  background: #3AAFA9;
  color: white;
  border: none;
  border-radius: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

const alertStyles = (tipo) => css`
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 20px;
  background: ${tipo === 'ok' ? '#E0F5F3' : '#fee2e2'};
  color: ${tipo === 'ok' ? '#006847' : '#b91c1c'};
  border: 1px solid ${tipo === 'ok' ? '#3AAFA9' : '#fca5a5'};
`

const emptyForm = () => ({ nome: '', redeSocial: '', cidade: '', estado: '', categoriaPrincipal: '', categoriaSecundaria: '' })

export const SugestaoEstabelecimentoPage = () => {
  const { user } = useAuth()
  const [form, setForm] = useState(emptyForm())
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [enviado, setEnviado] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.redeSocial.trim() || !form.cidade.trim() || !form.estado || !form.categoriaPrincipal) {
      setFeedback({ msg: 'Preencha todos os campos obrigatórios.', tipo: 'erro' })
      return
    }

    setLoading(true)
    setFeedback(null)
    try {
      await sugerirEstabelecimento({
        nome:                form.nome.trim(),
        redeSocial:          form.redeSocial.trim(),
        cidade:              form.cidade.trim(),
        estado:              form.estado,
        sugeridoPor:         user?.userId || '',
        categoriaPrincipal:  form.categoriaPrincipal,
        categoriaSecundaria: form.categoriaSecundaria || undefined,
      })
      setEnviado(true)
    } catch (err) {
      setFeedback({ msg: err?.message || 'Erro ao enviar. Tente novamente.', tipo: 'erro' })
    } finally {
      setLoading(false)
    }
  }

  if (enviado) {
    return (
      <div css={pageStyles}>
        <div css={cardStyles}>
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏳️‍🌈</div>
            <h2 css={headingStyles}>Sugestão enviada!</h2>
            <p css={subheadingStyles}>
              Obrigado por contribuir! Seu estabelecimento será revisado pela nossa equipe antes de ser publicado no mapa.
            </p>
            <button
              css={submitBtnStyles}
              style={{ marginTop: 8 }}
              onClick={() => { setForm(emptyForm()); setEnviado(false) }}
            >
              Sugerir outro estabelecimento
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div css={pageStyles}>
      <div css={cardStyles}>
        <h1 css={headingStyles}>Sugerir estabelecimento</h1>
        <p css={subheadingStyles}>
          Conhece um bar, restaurante ou espaço LGBT+ que ainda não está no mapa?
          Compartilhe com a gente! Nossa equipe vai revisar e publicar em breve.
        </p>

        {feedback && <div css={alertStyles(feedback.tipo)}>{feedback.msg}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div css={fieldGroupStyles}>
            <label>Nome do estabelecimento *</label>
            <input
              placeholder="Ex: Bar da Aurora"
              value={form.nome}
              onChange={set('nome')}
            />
          </div>

          <div css={fieldGroupStyles}>
            <label>Rede social *</label>
            <input
              placeholder="@usuario ou link do Instagram, Facebook..."
              value={form.redeSocial}
              onChange={set('redeSocial')}
            />
          </div>

          <div css={fieldGroupStyles}>
            <label>Categoria principal *</label>
            <select value={form.categoriaPrincipal} onChange={set('categoriaPrincipal')}>
              <option value="">Selecionar</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div css={fieldGroupStyles}>
            <label>Categoria secundária <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 11, color: '#9ABFC2' }}>(opcional)</span></label>
            <select value={form.categoriaSecundaria} onChange={set('categoriaSecundaria')}>
              <option value="">Nenhuma</option>
              {CATEGORIAS.filter((c) => c !== form.categoriaPrincipal).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div css={rowStyles}>
            <div css={fieldGroupStyles}>
              <label>Cidade *</label>
              <input
                placeholder="Ex: Porto Alegre"
                value={form.cidade}
                onChange={set('cidade')}
              />
            </div>
            <div css={fieldGroupStyles}>
              <label>Estado *</label>
              <select value={form.estado} onChange={set('estado')}>
                <option value="">Selecionar</option>
                {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>

          <button css={submitBtnStyles} type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar sugestão'}
          </button>
        </form>
      </div>
    </div>
  )
}
