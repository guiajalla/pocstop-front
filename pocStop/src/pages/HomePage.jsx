import React, { useState } from 'react'
import { css } from '@emotion/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_ESTABLISHMENTS = [
  { id: 1, nome: 'Bar Neon',       categoria: 'Bar',       cidade: 'São Paulo',      rating: 4.7, totalAvaliacoes: 96  },
  { id: 2, nome: 'Café Aurora',    categoria: 'Cafeteria', cidade: 'Porto Alegre',   rating: 4.8, totalAvaliacoes: 128 },
  { id: 3, nome: 'Studio Prisma',  categoria: 'Cultura',   cidade: 'Curitiba',       rating: 4.9, totalAvaliacoes: 74  },
  { id: 4, nome: 'Clube Arco-íris',categoria: 'Club',      cidade: 'Rio de Janeiro', rating: 4.6, totalAvaliacoes: 215 },
  { id: 5, nome: 'Livraria Plural',categoria: 'Cultura',   cidade: 'Belo Horizonte', rating: 4.5, totalAvaliacoes: 51  },
]

const MOCK_STATS = { avaliacoes: '12.4k', locais: '1.8k', cidades: 96 }

const MAP_PINS = [
  { top: '28%', left: '22%' },
  { top: '52%', left: '58%' },
  { top: '38%', left: '70%' },
  { top: '68%', left: '33%' },
  { top: '22%', left: '52%' },
]

// ─── Base compartilhado ───────────────────────────────────────────────────────

const baseCard = `
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.04);
`

// ─── Estilos da página ────────────────────────────────────────────────────────

const pageWrap = css`
  flex: 1;
  background: #f3f5f3;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const inner = css`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const mainGrid = css`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

// Mapa
const mapCard = css`${baseCard}`

const mapCardHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
`

const sectionTitle = css`
  margin: 0 0 3px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`

const sectionSub = css`
  margin: 0;
  font-size: 12px;
  color: #6b7280;
`

const filterBtn = css`
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 5px 14px;
  font-size: 13px;
  cursor: pointer;
  color: #374151;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: #f9fafb; }
`

const mapArea = css`
  height: 420px;
  background: #e2ede2;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  border: 1px solid #cde0cd;
`

const mapGridOverlay = css`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(130,180,130,0.35) 1px, transparent 1px),
    linear-gradient(90deg, rgba(130,180,130,0.35) 1px, transparent 1px);
  background-size: 48px 48px;
`

const mapCenter = css`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #4a7c4a;
  pointer-events: none;
`

// Locais em destaque
const destaqueCard = css`${baseCard}`

const destaqueHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
`

const verTodosBtn = css`
  background: none;
  border: none;
  color: #15803d;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  &:hover { text-decoration: underline; }
`

const estabList = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 440px;
  overflow-y: auto;
  padding-right: 2px;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
`

const estabItem = css`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px;
  transition: box-shadow 0.15s;
  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
`

const estabTopRow = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3px;
`

const estabName = css`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const ratingBadge = css`
  display: flex;
  align-items: center;
  gap: 3px;
  background: #fef3c7;
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 12px;
  font-weight: 600;
  color: #92400e;
  white-space: nowrap;
`

const estabMeta = css`
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 6px;
`

const avaliacoesCount = css`
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 10px;
`

const actionsRow = css`
  display: flex;
  gap: 8px;
`

const verLocalBtn = css`
  flex: 1;
  padding: 7px 0;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  background: white;
  font-size: 12px;
  cursor: pointer;
  color: #374151;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: #f9fafb; }
`

const avaliarBtn = css`
  flex: 1;
  padding: 7px 0;
  border: none;
  border-radius: 7px;
  background: #15803d;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: #166534; }
`

// Stats
const statsGrid = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`

const statCard = css`${baseCard}`

const statLabel = css`
  margin: 0 0 6px;
  font-size: 13px;
  color: #6b7280;
`

const statValue = css`
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.5px;
`

// CTA
const ctaSection = css`
  background: #111827;
  border-radius: 12px;
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  @media (max-width: 640px) { flex-direction: column; text-align: center; }
`

const ctaTitleGroup = css`
  h2 { margin: 0 0 6px; font-size: 20px; font-weight: 700; color: white; }
  p  { margin: 0; font-size: 13px; color: rgba(255,255,255,0.65); }
`

const ctaButton = css`
  background: white;
  color: #111827;
  border: none;
  border-radius: 10px;
  padding: 12px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  transition: opacity 0.15s;
  &:hover { opacity: 0.88; }
`

// ─── Modal de avaliação ───────────────────────────────────────────────────────

const modalOverlay = css`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
`

const modalBox = css`
  background: white;
  border-radius: 16px;
  padding: 28px;
  width: 440px;
  max-width: 100%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
`

const modalTop = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`

const modalTitleText = css`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const closeBtnStyle = css`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  line-height: 1;
  &:hover { color: #374151; }
`

const starRowStyle = css`
  display: flex;
  gap: 6px;
  margin: 14px 0 20px;
`

const starBtnStyle = (active) => css`
  font-size: 34px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${active ? '#f59e0b' : '#e5e7eb'};
  padding: 0;
  line-height: 1;
  transition: color 0.1s, transform 0.1s;
  &:hover { transform: scale(1.1); }
`

const modalLabelStyle = css`
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`

const optionalStyle = css`
  font-weight: 400;
  color: #9ca3af;
  font-size: 13px;
`

const textareaStyle = css`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 90px;
  box-sizing: border-box;
  color: #111827;
  &:focus { outline: none; border-color: #15803d; box-shadow: 0 0 0 2px rgba(21,128,61,0.1); }
`

const submitBtnStyle = css`
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background: #15803d;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: #166534; }
  &:disabled { background: #d1d5db; cursor: default; color: #9ca3af; }
`

// ─── Componente: Modal de avaliação ──────────────────────────────────────────

function ReviewModal({ estab, onClose }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    // TODO: POST /avaliacoes quando a API estiver pronta
    onClose()
  }

  return (
    <div css={modalOverlay} onClick={onClose}>
      <div css={modalBox} onClick={e => e.stopPropagation()}>
        <div css={modalTop}>
          <h2 css={modalTitleText}>Avaliar {estab.nome}</h2>
          <button css={closeBtnStyle} onClick={onClose}>✕</button>
        </div>
        <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280', fontFamily: 'inherit' }}>
          {estab.categoria} • {estab.cidade}
        </p>

        <p css={modalLabelStyle} style={{ marginTop: 18 }}>Sua nota</p>
        <div css={starRowStyle}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              css={starBtnStyle(n <= (hovered || rating))}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(n)}
            >
              ★
            </button>
          ))}
        </div>

        <p css={modalLabelStyle}>
          Comentário <span css={optionalStyle}>(opcional)</span>
        </p>
        <textarea
          css={textareaStyle}
          placeholder="Conte sua experiência neste local..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <button css={submitBtnStyle} disabled={rating === 0} onClick={handleSubmit}>
          Publicar avaliação
        </button>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reviewTarget, setReviewTarget] = useState(null)

  const handleAvaliar = (estab) => {
    if (!user) { navigate('/auth'); return }
    setReviewTarget(estab)
  }

  const ctaSubtitle = user
    ? 'Você está logado e pode sugerir novos lugares para a comunidade.'
    : 'Faça login e sugira novos lugares para o mapa.'

  return (
    <div css={pageWrap}>
      <div css={inner}>

        {/* ── Mapa + Locais em destaque ── */}
        <div css={mainGrid}>

          {/* Mapa interativo */}
          <div css={mapCard}>
            <div css={mapCardHeader}>
              <div>
                <h2 css={sectionTitle}>Mapa interativo</h2>
                <p css={sectionSub}>Explore, clique nos pins e avalie seus lugares favoritos</p>
              </div>
              <button css={filterBtn}>Filtrar</button>
            </div>

            <div css={mapArea}>
              <div css={mapGridOverlay} />

              {/* Ruas decorativas */}
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22 }}
                viewBox="0 0 400 420"
                preserveAspectRatio="none"
              >
                <line x1="0"   y1="140" x2="400" y2="140" stroke="#2d6a2d" strokeWidth="7" />
                <line x1="0"   y1="280" x2="400" y2="280" stroke="#2d6a2d" strokeWidth="7" />
                <line x1="120" y1="0"   x2="120" y2="420" stroke="#2d6a2d" strokeWidth="7" />
                <line x1="280" y1="0"   x2="280" y2="420" stroke="#2d6a2d" strokeWidth="7" />
                <line x1="0"   y1="210" x2="400" y2="210" stroke="#2d6a2d" strokeWidth="2" />
                <line x1="200" y1="0"   x2="200" y2="420" stroke="#2d6a2d" strokeWidth="2" />
              </svg>

              {/* Pins dos estabelecimentos */}
              {MAP_PINS.map((pin, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: pin.top,
                    left: pin.left,
                    width: 18,
                    height: 18,
                    background: '#15803d',
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    border: '2px solid white',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                  }}
                />
              ))}

              <div css={mapCenter}>
                <span style={{ fontSize: 40 }}>🗺️</span>
                <span style={{ fontFamily: 'inherit', fontSize: 14 }}>Área do mapa</span>
                <span style={{ fontFamily: 'inherit', fontSize: 11, opacity: 0.7 }}>
                  Google Maps será integrado aqui
                </span>
              </div>
            </div>
          </div>

          {/* Locais em destaque */}
          <div css={destaqueCard}>
            <div css={destaqueHeader}>
              <div>
                <h2 css={sectionTitle}>Locais em destaque</h2>
                <p css={sectionSub}>Você pode avaliar direto pela listagem</p>
              </div>
              <button css={verTodosBtn}>Ver todos</button>
            </div>

            <div css={estabList}>
              {MOCK_ESTABLISHMENTS.map(estab => (
                <div key={estab.id} css={estabItem}>
                  <div css={estabTopRow}>
                    <h3 css={estabName}>{estab.nome}</h3>
                    <div css={ratingBadge}>★ {estab.rating.toFixed(1)}</div>
                  </div>
                  <p css={estabMeta}>{estab.categoria} • {estab.cidade}</p>
                  <p css={avaliacoesCount}>{estab.totalAvaliacoes} avaliações da comunidade</p>
                  <div css={actionsRow}>
                    <button css={verLocalBtn}>Ver local</button>
                    <button css={avaliarBtn} onClick={() => handleAvaliar(estab)}>
                      Avaliar local
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div css={statsGrid}>
          {[
            { label: 'Avaliações publicadas', value: MOCK_STATS.avaliacoes },
            { label: 'Locais cadastrados',    value: MOCK_STATS.locais    },
            { label: 'Cidades ativas',        value: MOCK_STATS.cidades   },
          ].map(({ label, value }) => (
            <div key={label} css={statCard}>
              <p css={statLabel}>{label}</p>
              <p css={statValue}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div css={ctaSection}>
          <div css={ctaTitleGroup}>
            <h2>Sentiu falta de algum local?</h2>
            <p>{ctaSubtitle}</p>
          </div>
          <button css={ctaButton} onClick={() => { if (!user) navigate('/auth') }}>
            Dê sua sugestão
          </button>
        </div>

      </div>

      {reviewTarget && (
        <ReviewModal estab={reviewTarget} onClose={() => setReviewTarget(null)} />
      )}
    </div>
  )
}
