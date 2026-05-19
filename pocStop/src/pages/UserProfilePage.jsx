import React, { useState } from 'react'
import { css } from '@emotion/react'
import { useAuth } from '../context/AuthContext'
import { GENEROS, ORIENTACOES, ESTADOS_BR } from '../components/auth/authConstants'
import { useSugestoesUsuario } from '../hooks/useSugestoesUsuario'

// ─── Mock data ───────────────────────────────────────────────────────────────
const MOCK_AVALIACOES = [
  {
    id: 1,
    nome: 'Bar Ocidente',
    tipo: 'Bar',
    cidade: 'Porto Alegre',
    bairro: 'Bom Fim',
    status: 'publicada',
    nota: 5.0,
    texto: 'Ambiente super autêntico, drinks ótimos e uma energia incrível. Um clássico da noite em Porto Alegre!',
    data: '12 Mar 2025',
  },
  {
    id: 2,
    nome: 'Café do Mercado',
    tipo: 'Cafeteria',
    cidade: 'Porto Alegre',
    bairro: 'Centro Histórico',
    status: 'editada',
    nota: 4.6,
    texto: 'Lugar aconchegante, ótimo café e uma vibe muito gostosa para passar a tarde.',
    data: '04 Mar 2025',
  },
  {
    id: 3,
    nome: 'Peppo Cucina',
    tipo: 'Restaurante',
    cidade: 'Porto Alegre',
    bairro: 'Moinhos de Vento',
    status: 'pendente',
    nota: 4.8,
    texto: 'Comida excelente, ambiente elegante e atendimento muito atencioso. Experiência ótima.',
    data: '26 Fev 2025',
  },
  {
    id: 4,
    nome: 'Capincho Bar',
    tipo: 'Bar',
    cidade: 'Canoas',
    bairro: 'Marechal Rondon',
    status: 'publicada',
    nota: 4.4,
    texto: 'Espaço legal, bom para ir com amigos e atendimento rápido. Gostei bastante da proposta.',
    data: '18 Fev 2025',
  },
]

const STATUS_CONFIG = {
  publicada: { label: 'Publicada', bg: '#E0F5F3', color: '#006847', border: '#A0D5D0' },
  editada:   { label: 'Editada',   bg: '#fffde7', color: '#f57f17', border: '#ffe082' },
  pendente:  { label: 'Pendente',  bg: '#fff3e0', color: '#e65100', border: '#ffcc80' },
}

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const formatarData = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getUTCDate()} ${MESES_ABREV[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

const STATUS_SUGESTAO_CONFIG = {
  aprovada:   { label: 'Aprovada',   bg: '#E0F5F3', color: '#006847', border: '#A0D5D0' },
  em_analise: { label: 'Em análise', bg: '#E8F4FD', color: '#1565C0', border: '#90CAF9' },
  recusada:   { label: 'Recusada',   bg: '#FEE2E2', color: '#c0392b', border: '#f5c6c6' },
  aguardando: { label: 'Aguardando', bg: '#fff3e0', color: '#e65100', border: '#ffcc80' },
}

const getTimelineSteps = (status) => {
  const labels = ['Sugerido', 'Em análise', 'Concluído']
  let doneUntil = 0
  if (status === 'em_analise') doneUntil = 1
  else if (status === 'aprovada' || status === 'recusada') doneUntil = 2
  return labels.map((label, i) => ({
    label,
    done: i < doneUntil,
    active: i === doneUntil,
  }))
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const pageWrapper = css`
  background: #F3F8F8;
  min-height: calc(100vh - 80px);
  padding: 32px 24px;
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
`

const layout = css`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const sidebar = css`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 0;
`

const avatarRow = css`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
`

const avatarCircle = css`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #1A3038;
  color: white;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: 'DM Sans', sans-serif;
`

const userNameStyle = css`
  font-size: 16px;
  font-weight: 700;
  color: #1A3038;
  margin: 0 0 2px;
`

const userCityStyle = css`
  font-size: 13px;
  color: #5A7A80;
  margin: 0;
`

const sidebarStatsList = css`
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  li {
    font-size: 13px;
    color: #5A7A80;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`

const editarPerfilBtn = css`
  width: 100%;
  background: #006847;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 11px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`

const verSalvosBtn = css`
  width: 100%;
  background: transparent;
  color: #1A3038;
  border: 1.5px solid #C2DFE0;
  border-radius: 8px;
  padding: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 24px;
  transition: background 0.2s;
  &:hover { background: #F3F8F8; }
`

const filtrosDivider = css`
  height: 1px;
  background: #E0F5F3;
  margin-bottom: 16px;
`

const filtrosTitulo = css`
  font-size: 13px;
  font-weight: 700;
  color: #1A3038;
  margin: 0 0 4px;
`

const filtrosSubtitulo = css`
  font-size: 12px;
  color: #5A7A80;
  margin: 0 0 14px;
`

const filtroSelect = css`
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
  cursor: pointer;
  margin-bottom: 10px;
  &:focus { border-color: #3AAFA9; }
`

const mainContent = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const statsRow = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

const statCard = css`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
  span {
    font-size: 12px;
    color: #5A7A80;
    font-weight: 500;
  }
  strong {
    font-size: 30px;
    font-weight: 700;
    color: #1A3038;
    line-height: 1;
  }
`

const reviewsPanel = css`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
`

const reviewsHeader = css`
  padding: 20px 20px 16px;
  border-bottom: 1px solid #E0F5F3;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
`

const reviewsTitle = css`
  font-size: 16px;
  font-weight: 700;
  color: #1A3038;
  margin: 0 0 4px;
`

const reviewsSubtitle = css`
  font-size: 12px;
  color: #5A7A80;
  margin: 0;
`

const reviewsControls = css`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  @media (max-width: 640px) {
    width: 100%;
    flex-shrink: 1;
  }
`

const searchInput = css`
  background: #F3F8F8;
  border: 1px solid #C2DFE0;
  border-radius: 6px;
  padding: 8px 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #1A3038;
  outline: none;
  width: 200px;
  @media (max-width: 640px) { flex: 1; width: auto; min-width: 0; }
  &:focus { border-color: #3AAFA9; background: white; }
  &::placeholder { color: #9ABFC2; }
`

const maisRecentesBtn = css`
  background: white;
  border: 1.5px solid #C2DFE0;
  border-radius: 6px;
  padding: 8px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #1A3038;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #F3F8F8; }
`

const reviewCard = css`
  padding: 18px 20px;
  border-bottom: 1px solid #EBF5F5;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  &:last-child { border-bottom: none; }
  @media (max-width: 640px) { flex-direction: column; }
`

const reviewLeft = css`
  flex: 1;
  min-width: 0;
`

const reviewTopRow = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
`

const reviewNome = css`
  font-size: 14px;
  font-weight: 700;
  color: #1A3038;
`

const statusBadge = (status) => {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.pendente
  return css`
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
    background: ${c.bg};
    color: ${c.color};
    border: 1px solid ${c.border};
  `
}

const reviewNota = css`
  font-size: 12px;
  font-weight: 600;
  color: #f57f17;
  display: flex;
  align-items: center;
  gap: 3px;
`

const reviewCategoria = css`
  font-size: 12px;
  color: #5A7A80;
  margin-bottom: 8px;
`

const reviewTexto = css`
  font-size: 13px;
  color: #3A4E54;
  line-height: 1.5;
  margin-bottom: 6px;
`

const reviewData = css`
  font-size: 11px;
  color: #9ABFC2;
`

const reviewRight = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
`

const editarAvaliacaoBtn = css`
  background: #006847;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`

const verLocalBtn = css`
  background: white;
  color: #1A3038;
  border: 1.5px solid #C2DFE0;
  border-radius: 6px;
  padding: 7px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #F3F8F8; }
`

const excluirBtn = css`
  background: white;
  color: #c0392b;
  border: 1.5px solid #f5c6c6;
  border-radius: 6px;
  padding: 7px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #fee2e2; }
`

// ─── Tab & suggestion styles ──────────────────────────────────────────────────
const tabsNav = css`
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  gap: 4px;
`

const tabBtn = (active) => css`
  flex: 1;
  padding: 10px 16px;
  background: ${active ? '#1A3038' : 'transparent'};
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${active ? 'white' : '#5A7A80'};
  cursor: pointer;
  transition: all 0.18s;
  &:hover {
    background: ${active ? '#1A3038' : '#F3F8F8'};
    color: ${active ? 'white' : '#1A3038'};
  }
`

const sugestaoCard = css`
  padding: 18px 20px;
  border-bottom: 1px solid #EBF5F5;
  display: flex;
  flex-direction: column;
  gap: 12px;
  &:last-child { border-bottom: none; }
`

const sugestaoTop = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
`

const sugestaoTopRow = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
`

const statusSugestaoBadge = (status) => {
  const c = STATUS_SUGESTAO_CONFIG[status] || STATUS_SUGESTAO_CONFIG.aguardando
  return css`
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
    background: ${c.bg};
    color: ${c.color};
    border: 1px solid ${c.border};
  `
}

const timelineWrapper = css`
  display: flex;
  align-items: flex-start;
  flex-shrink: 0;
`

const timelineStepWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const timelineCircle = (done, active) => css`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${done ? '12px' : '11px'};
  font-weight: 700;
  background: ${done ? '#006847' : active ? '#3AAFA9' : '#F3F8F8'};
  color: ${done || active ? 'white' : '#9ABFC2'};
  border: 2px solid ${done ? '#006847' : active ? '#3AAFA9' : '#C2DFE0'};
`

const timelineLabel = (done, active) => css`
  font-size: 10px;
  font-weight: ${active ? '700' : '500'};
  color: ${done ? '#006847' : active ? '#3AAFA9' : '#9ABFC2'};
  white-space: nowrap;
`

const timelineConnector = (done) => css`
  width: 36px;
  height: 2px;
  background: ${done ? '#006847' : '#C2DFE0'};
  margin-top: 13px;
  flex-shrink: 0;
`

const obsBoxStyle = (status) => {
  const cfg = {
    aprovada: { bg: '#E0F5F3', border: '#A0D5D0', color: '#006847' },
    recusada: { bg: '#FEE2E2', border: '#f5c6c6', color: '#c0392b' },
  }
  const c = cfg[status] || { bg: '#F3F8F8', border: '#C2DFE0', color: '#5A7A80' }
  return css`
    background: ${c.bg};
    border: 1px solid ${c.border};
    border-radius: 6px;
    padding: 10px 13px;
    font-size: 13px;
    color: ${c.color};
    line-height: 1.5;
  `
}

const obsBoxNeutro = css`
  background: #F3F8F8;
  border: 1px solid #C2DFE0;
  border-radius: 6px;
  padding: 10px 13px;
  font-size: 13px;
  color: #5A7A80;
  line-height: 1.5;
`

// ─── Modal styles ─────────────────────────────────────────────────────────────
const overlayStyles = css`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
`

const modalStyles = css`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  overflow: hidden;
`

const modalHeaderStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #E0F5F3;
  h2 {
    font-size: 16px;
    font-weight: 700;
    color: #1A3038;
    margin: 0;
    font-family: 'DM Sans', sans-serif;
  }
`

const modalCloseBtn = css`
  background: none;
  border: none;
  font-size: 18px;
  color: #5A7A80;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
  &:hover { background: #F3F8F8; color: #1A3038; }
`

const modalBody = css`
  padding: 20px 24px 24px;
`

const fieldStyles = css`
  margin-bottom: 14px;
  label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #5A7A80;
    margin-bottom: 6px;
    font-family: 'DM Sans', sans-serif;
  }
  input, select {
    width: 100%;
    background: #F3F8F8;
    border: 1px solid #C2DFE0;
    border-radius: 6px;
    padding: 10px 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1A3038;
    outline: none;
    appearance: none;
    transition: border-color 0.2s;
    &:focus { border-color: #3AAFA9; background: white; }
    &::placeholder { color: #9ABFC2; }
    option { background: white; }
    &:disabled {
      background: #EDF5F5;
      color: #8AAAA0;
      cursor: not-allowed;
      border-color: #C2DFE0;
    }
  }
`

const rowStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`

const modalSubmitBtn = css`
  width: 100%;
  background: #006847;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

const modalErrorStyles = css`
  background: rgba(192,57,43,0.08);
  border: 1px solid rgba(192,57,43,0.25);
  border-radius: 6px;
  padding: 10px 13px;
  font-size: 13px;
  color: #c0392b;
  margin-bottom: 14px;
  font-family: 'DM Sans', sans-serif;
`

const modalSuccessStyles = css`
  background: rgba(0,104,71,0.08);
  border: 1px solid rgba(0,104,71,0.25);
  border-radius: 6px;
  padding: 12px;
  font-size: 14px;
  color: #006847;
  text-align: center;
  font-family: 'DM Sans', sans-serif;
`

// ─── EditarPerfilModal ────────────────────────────────────────────────────────
const EditarPerfilModal = ({ onClose }) => {
  const { perfil, atualizarPerfil } = useAuth()

  const [form, setForm] = useState({
    nome:             perfil?.name               || '',
    cidade:           perfil?.city               || '',
    estado:           perfil?.state              || '',
    dataNascimento:   perfil?.birth_date          || '',
    genero:           perfil?.gender              || '',
    orientacaoSexual: perfil?.sexual_orientation  || '',
  })
  const [loading, setLoading]   = useState(false)
  const [erro, setErro]         = useState(null)
  const [sucesso, setSucesso]   = useState(false)

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErro(null)
    try {
      await atualizarPerfil(form)
      setSucesso(true)
      setTimeout(onClose, 1500)
    } catch {
      setErro('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div css={overlayStyles} onClick={onClose}>
      <div css={modalStyles} onClick={e => e.stopPropagation()}>
        <div css={modalHeaderStyles}>
          <h2>Editar perfil</h2>
          <button css={modalCloseBtn} onClick={onClose}>✕</button>
        </div>

        <div css={modalBody}>
          {sucesso ? (
            <div css={modalSuccessStyles}>Perfil atualizado com sucesso!</div>
          ) : (
            <form onSubmit={handleSubmit}>
              {erro && <div css={modalErrorStyles}>{erro}</div>}

              <div css={fieldStyles}>
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={form.nome}
                  disabled
                />
              </div>

              <div css={rowStyles}>
                <div css={fieldStyles}>
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    id="cidade"
                    name="cidade"
                    type="text"
                    value={form.cidade}
                    onChange={handleChange}
                    placeholder="Sua cidade"
                  />
                </div>
                <div css={fieldStyles}>
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                  >
                    <option value="">Selecione</option>
                    {ESTADOS_BR.map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div css={fieldStyles}>
                <label htmlFor="dataNascimento">Data de nascimento</label>
                <input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={form.dataNascimento}
                  disabled
                />
              </div>

              <div css={rowStyles}>
                <div css={fieldStyles}>
                  <label htmlFor="genero">Gênero</label>
                  <select
                    id="genero"
                    name="genero"
                    value={form.genero}
                    onChange={handleChange}
                  >
                    <option value="">Selecione</option>
                    {GENEROS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div css={fieldStyles}>
                  <label htmlFor="orientacaoSexual">Orientação sexual</label>
                  <select
                    id="orientacaoSexual"
                    name="orientacaoSexual"
                    value={form.orientacaoSexual}
                    onChange={handleChange}
                  >
                    <option value="">Selecione</option>
                    {ORIENTACOES.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button css={modalSubmitBtn} type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── UserProfilePage ──────────────────────────────────────────────────────────
export const UserProfilePage = () => {
  const { perfil, user } = useAuth()
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState('avaliacoes')
  const { sugestoes, loading: loadingSugestoes, error: errorSugestoes, refresh: refreshSugestoes } = useSugestoesUsuario(user?.userId)

  const nome = perfil?.name || user?.signInDetails?.loginId || 'Usuário'
  const cidade = perfil?.city || '—'

  const partes = nome.trim().split(' ')
  const nomeAbreviado = partes.length > 1
    ? `${partes[0]} ${partes[partes.length - 1][0]}.`
    : partes[0]
  const inicial = partes[0]?.[0]?.toUpperCase() || 'U'

  const sugestoesAprovadas = sugestoes.filter(s => s.status === 'aprovada').length
  const sugestoesEmAnalise = sugestoes.filter(s => s.status === 'em_analise' || s.status === 'aguardando').length

  return (
    <div css={pageWrapper}>
      <div css={layout}>
        {/* ── Sidebar ── */}
        <aside css={sidebar}>
          <div css={avatarRow}>
            <div css={avatarCircle}>{inicial}</div>
            <div>
              <p css={userNameStyle}>{nomeAbreviado}</p>
              <p css={userCityStyle}>{cidade}</p>
            </div>
          </div>

          <ul css={sidebarStatsList}>
            <li>⭐ {MOCK_AVALIACOES.length} avaliações enviadas</li>
            <li>⭐ Nota média: 4.7</li>
            <li>🏪 {sugestoes.length} locais sugeridos</li>
            <li>📍 Contribuindo com a comunidade PocStop</li>
          </ul>

          <button css={editarPerfilBtn} onClick={() => setEditandoPerfil(true)}>
            Editar perfil
          </button>
        </aside>

        {/* ── Main content ── */}
        <main css={mainContent}>
          {/* Tab navigation */}
          <div css={tabsNav}>
            <button
              css={tabBtn(abaAtiva === 'avaliacoes')}
              onClick={() => setAbaAtiva('avaliacoes')}
            >
              Minhas Avaliações
            </button>
            <button
              css={tabBtn(abaAtiva === 'sugestoes')}
              onClick={() => setAbaAtiva('sugestoes')}
            >
              Minhas Sugestões
            </button>
          </div>

          {abaAtiva === 'avaliacoes' ? (
            <>
              <div css={statsRow}>
                <div css={statCard}>
                  <span>Total de avaliações</span>
                  <strong>18</strong>
                </div>
                <div css={statCard}>
                  <span>Média das suas notas</span>
                  <strong>4.7</strong>
                </div>
                <div css={statCard}>
                  <span>Locais avaliados</span>
                  <strong>14</strong>
                </div>
              </div>

              <div css={reviewsPanel}>
                <div css={reviewsHeader}>
                  <div>
                    <p css={reviewsTitle}>Minhas avaliações</p>
                    <p css={reviewsSubtitle}>Veja, edite ou remova as reviews que você já publicou</p>
                  </div>
                  <div css={reviewsControls}>
                    <input css={searchInput} placeholder="Buscar por estabelecimento..." />
                    <button css={maisRecentesBtn}>Mais recentes</button>
                  </div>
                </div>

                {MOCK_AVALIACOES.map(av => (
                  <div key={av.id} css={reviewCard}>
                    <div css={reviewLeft}>
                      <div css={reviewTopRow}>
                        <span css={reviewNome}>{av.nome}</span>
                        <span css={statusBadge(av.status)}>
                          {STATUS_CONFIG[av.status]?.label}
                        </span>
                        <span css={reviewNota}>⭐ {av.nota.toFixed(1)}</span>
                      </div>
                      <p css={reviewCategoria}>
                        {av.tipo} • {av.cidade} • {av.bairro}
                      </p>
                      <p css={reviewTexto}>{av.texto}</p>
                      <p css={reviewData}>Avaliado em {av.data}</p>
                    </div>

                    <div css={reviewRight}>
                      <button css={editarAvaliacaoBtn}>Editar avaliação</button>
                      <button css={verLocalBtn}>Ver local</button>
                      <button css={excluirBtn}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div css={statsRow}>
                <div css={statCard}>
                  <span>Total de sugestões</span>
                  <strong>{loadingSugestoes ? '...' : sugestoes.length}</strong>
                </div>
                <div css={statCard}>
                  <span>Aprovadas</span>
                  <strong>{loadingSugestoes ? '...' : sugestoesAprovadas}</strong>
                </div>
                <div css={statCard}>
                  <span>Em análise</span>
                  <strong>{loadingSugestoes ? '...' : sugestoesEmAnalise}</strong>
                </div>
              </div>

              <div css={reviewsPanel}>
                <div css={reviewsHeader}>
                  <div>
                    <p css={reviewsTitle}>Minhas sugestões</p>
                    <p css={reviewsSubtitle}>Acompanhe o status dos estabelecimentos que você indicou</p>
                  </div>
                  <div css={reviewsControls}>
                    <input css={searchInput} placeholder="Buscar sugestão..." />
                    <button css={maisRecentesBtn} onClick={refreshSugestoes} disabled={loadingSugestoes}>
                      {loadingSugestoes ? 'Atualizando...' : 'Atualizar'}
                    </button>
                  </div>
                </div>

                {loadingSugestoes ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5A7A80', fontSize: 14 }}>
                    Carregando suas sugestões...
                  </div>
                ) : errorSugestoes ? (
                  <div style={{ padding: '20px' }}>
                    <div css={obsBoxNeutro}>{errorSugestoes}</div>
                  </div>
                ) : sugestoes.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5A7A80', fontSize: 14 }}>
                    Você ainda não fez nenhuma sugestão.
                  </div>
                ) : (
                  sugestoes.map(sg => (
                    <div key={sg.estabelecimento_id} css={sugestaoCard}>
                      <div css={sugestaoTop}>
                        <div>
                          <div css={sugestaoTopRow}>
                            <span css={reviewNome}>{sg.nome}</span>
                            <span css={statusSugestaoBadge(sg.status)}>
                              {STATUS_SUGESTAO_CONFIG[sg.status]?.label}
                            </span>
                          </div>
                          <p css={reviewCategoria}>
                            {[sg.tipo, sg.cidade, sg.bairro].filter(Boolean).join(' • ')}
                          </p>
                          <p css={reviewData}>Sugerido em {formatarData(sg.created_at)}</p>
                        </div>

                        <div css={timelineWrapper}>
                          {getTimelineSteps(sg.status).map((step, i, arr) => (
                            <React.Fragment key={step.label}>
                              <div css={timelineStepWrapper}>
                                <div css={timelineCircle(step.done, step.active)}>
                                  {step.done ? '✓' : i + 1}
                                </div>
                                <span css={timelineLabel(step.done, step.active)}>
                                  {step.label}
                                </span>
                              </div>
                              {i < arr.length - 1 && (
                                <div css={timelineConnector(step.done)} />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {sg.observacao ? (
                        <div css={obsBoxStyle(sg.status)}>
                          <strong>Retorno da equipe:</strong> {sg.observacao}
                        </div>
                      ) : sg.status === 'em_analise' ? (
                        <div css={obsBoxNeutro}>
                          Sua sugestão está sendo analisada pela nossa equipe. Em breve você terá um retorno.
                        </div>
                      ) : sg.status === 'aguardando' ? (
                        <div css={obsBoxNeutro}>
                          Sua sugestão foi recebida e está na fila de análise. Obrigado pela contribuição!
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {editandoPerfil && (
        <EditarPerfilModal onClose={() => setEditandoPerfil(false)} />
      )}
    </div>
  )
}
