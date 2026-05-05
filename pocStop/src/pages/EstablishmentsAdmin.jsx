import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { css, Global } from '@emotion/react'

// ─── Estilos ──────────────────────────────────────────────────────────────────

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #f7f9f7;
    --surface: #ffffff;
    --border: #e0ebe0;
    --accent: #2d7a2d;
    --accent-light: #e8f5e8;
    --text: #1a2e1a;
    --text-muted: #6b8a6b;
    --pending: #b45309;
    --pending-bg: #fef3c7;
    --approved: #2d7a2d;
    --approved-bg: #e8f5e8;
    --rejected: #b91c1c;
    --rejected-bg: #fee2e2;
    --radius: 6px;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }
`

const pageStyles = css`
  min-height: 100vh;
  background: var(--bg);
  padding: 32px;

  @media (max-width: 768px) { padding: 16px; }
`

const headerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
`

const titleStyles = css`
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.3px;
`

const newBtnStyles = css`
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius);
  padding: 10px 20px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;
  box-shadow: var(--shadow);
  &:hover { opacity: 0.85; }
`

const layoutStyles = css`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 20px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const panelStyles = css`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow);
  overflow: hidden;
`

const toolbarStyles = css`
  display: flex;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
`

const searchStyles = css`
  flex: 1;
  min-width: 180px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: var(--text);
  outline: none;
  &:focus { border-color: var(--accent); }
  &::placeholder { color: var(--text-muted); }
`

const filterBtnStyles = (active) => css`
  padding: 8px 14px;
  border-radius: var(--radius);
  border: 1px solid ${active ? 'var(--accent)' : 'var(--border)'};
  background: ${active ? 'var(--accent-light)' : 'var(--surface)'};
  color: ${active ? 'var(--accent)' : 'var(--text-muted)'};
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: ${active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  &:hover { border-color: var(--accent); color: var(--accent); }
`

const tableStyles = css`
  width: 100%;
  border-collapse: collapse;
`

const thStyles = css`
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
`

const trStyles = (selected) => css`
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  background: ${selected ? 'var(--accent-light)' : 'var(--surface)'};
  transition: background 0.12s;
  &:hover { background: var(--accent-light); }
  &:last-child { border-bottom: none; }
`

const tdStyles = css`
  padding: 12px 16px;
  font-size: 13px;
`

const badgeStyles = (status) => {
  const map = {
    pendente:  { bg: 'var(--pending-bg)',  color: 'var(--pending)',  label: 'Pendente'   },
    aprovado:  { bg: 'var(--approved-bg)', color: 'var(--approved)', label: 'Aprovado'   },
    rejeitado: { bg: 'var(--rejected-bg)', color: 'var(--rejected)', label: 'Rejeitado'  },
    rascunho:  { bg: '#f3f4f6',            color: '#6b7280',         label: 'Rascunho'   },
  }
  const s = map[status] || map.pendente
  return css`
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    background: ${s.bg};
    color: ${s.color};
  `
}

const formPanelStyles = css`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow);
  position: sticky;
  top: 24px;
`

const formHeaderStyles = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 0;
  margin-bottom: 4px;
`

const formTitleStyles = css`
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
`

const formSubtitleStyles = css`
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
`

const formBodyFormStyles = css`
  padding: 16px 20px 20px;
  max-height: 75vh;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`

const fieldGroupStyles = css`
  margin-bottom: 12px;

  label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 5px;
  }

  input, select, textarea {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 8px 11px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text);
    outline: none;
    appearance: none;
    transition: border-color 0.15s;
    &:focus { border-color: var(--accent); background: white; }
    &::placeholder { color: #b0c4b0; }
    option { background: white; }
  }

  textarea { resize: vertical; min-height: 60px; }
`

const rowFieldStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

const formActionsStyles = css`
  display: flex;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
`

const btnRejectStyles = css`
  padding: 9px 16px;
  border: 1px solid var(--rejected);
  background: white;
  color: var(--rejected);
  border-radius: var(--radius);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: var(--rejected-bg); }
`

const btnDraftStyles = css`
  padding: 9px 16px;
  border: 1px solid var(--border);
  background: white;
  color: var(--text-muted);
  border-radius: var(--radius);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: var(--text-muted); color: var(--text); }
`

const btnApproveStyles = css`
  flex: 1;
  padding: 9px 16px;
  border: none;
  background: var(--accent);
  color: white;
  border-radius: var(--radius);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

const emptyStyles = css`
  padding: 48px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
`

const emptyPanelStyles = css`
  padding: 48px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const coordHintStyles = css`
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
  font-style: italic;
`

const CATEGORIAS = [
  'Bar', 'Restaurante', 'Cafeteria', 'Boate / Club', 'Espaço Cultural',
  'Hotel / Hospedagem', 'Salão de Beleza', 'Clínica / Saúde', 'Loja',
  'Academia', 'Livraria', 'Outro',
]

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyForm = () => ({
  nome: '', cidade: '', redeSocial: '', sugeridoPor: '',
  endereco: '', bairro: '', pais: 'Brasil',
  latitude: '', longitude: '',
  categoriaPrincipal: '', categoriaSecundaria: '',
})

// ─── Componente principal ─────────────────────────────────────────────────────

export const AdminEstabelecimentosPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [isNovo, setIsNovo] = useState(false)
  const [feedback, setFeedback] = useState(null)

  // Carrega lista ao montar
  useEffect(() => {
    carregarLista()
  }, [])

  const carregarLista = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/estabelecimentos`, {
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      setEstabelecimentos(data.items || [])
    } catch {
      setEstabelecimentos([])
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const selecionarItem = (item) => {
    setIsNovo(false)
    setSelecionado(item)
    setForm({
      nome:                item.nome || '',
      cidade:              item.cidade || '',
      redeSocial:          item.rede_social || '',
      sugeridoPor:         item.sugerido_por || '',
      endereco:            item.endereco || '',
      bairro:              item.bairro || '',
      pais:                item.pais || 'Brasil',
      latitude:            item.latitude || '',
      longitude:           item.longitude || '',
      categoriaPrincipal:  item.categoria_principal || '',
      categoriaSecundaria: item.categoria_secundaria || '',
    })
  }

  const novoEstabelecimento = () => {
    setIsNovo(true)
    setSelecionado(null)
    setForm(emptyForm())
  }

  const mostrarFeedback = (msg, tipo = 'ok') => {
    setFeedback({ msg, tipo })
    setTimeout(() => setFeedback(null), 3000)
  }

  const validarForm = () => {
    const obrigatorios = ['nome', 'cidade', 'redeSocial', 'endereco', 'bairro', 'latitude', 'longitude', 'categoriaPrincipal']
    return obrigatorios.every((f) => form[f]?.toString().trim() !== '')
  }

  const salvar = async (status) => {
    if (status === 'aprovado' && !validarForm()) {
      mostrarFeedback('Preencha todos os campos obrigatórios para aprovar.', 'erro')
      return
    }

    setSaving(true)
    try {
      const payload = {
        estabelecimento_id: selecionado?.estabelecimento_id || undefined,
        nome:                form.nome,
        cidade:              form.cidade,
        rede_social:         form.redeSocial,
        sugerido_por:        form.sugeridoPor || user?.signInDetails?.loginId || '',
        endereco:            form.endereco,
        bairro:              form.bairro,
        pais:                form.pais,
        latitude:            form.latitude,
        longitude:           form.longitude,
        categoria_principal: form.categoriaPrincipal,
        categoria_secundaria:form.categoriaSecundaria,
        status,
        atualizado_por:      user?.signInDetails?.loginId || user?.username,
        updated_at:          new Date().toISOString(),
        ...(isNovo && { created_at: new Date().toISOString() }),
      }

      const method = selecionado ? 'PUT' : 'POST'
      const url = selecionado
        ? `${BASE_URL}/estabelecimentos/${selecionado.estabelecimento_id}`
        : `${BASE_URL}/estabelecimentos`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()

      const msgs = {
        aprovado:  'Estabelecimento aprovado e publicado!',
        rascunho:  'Rascunho salvo.',
        rejeitado: 'Estabelecimento rejeitado.',
      }
      mostrarFeedback(msgs[status] || 'Salvo.')
      await carregarLista()
      setSelecionado(null)
      setIsNovo(false)
      setForm(emptyForm())
    } catch {
      mostrarFeedback('Erro ao salvar. Tente novamente.', 'erro')
    } finally {
      setSaving(false)
    }
  }

  // Filtragem
  const listagem = estabelecimentos.filter((e) => {
    const matchFiltro = filtro === 'todos' || e.status === filtro
    const matchBusca  = !busca || [e.nome, e.cidade, e.sugerido_por]
      .some((v) => v?.toLowerCase().includes(busca.toLowerCase()))
    return matchFiltro && matchBusca
  })

  const contagem = {
    todos:     estabelecimentos.length,
    pendente:  estabelecimentos.filter((e) => e.status === 'pendente').length,
    aprovado:  estabelecimentos.filter((e) => e.status === 'aprovado').length,
    rejeitado: estabelecimentos.filter((e) => e.status === 'rejeitado').length,
  }

  const formAberto = selecionado || isNovo

  return (
    <>
      <Global styles={globalStyles} />
      <div css={pageStyles}>

        {/* Feedback toast */}
        {feedback && (
          <div style={{
            position: 'fixed', top: 80, right: 24, zIndex: 999,
            background: feedback.tipo === 'erro' ? '#fee2e2' : '#e8f5e8',
            color: feedback.tipo === 'erro' ? '#b91c1c' : '#2d7a2d',
            border: `1px solid ${feedback.tipo === 'erro' ? '#fca5a5' : '#86efac'}`,
            borderRadius: 8, padding: '12px 20px', fontSize: 13, fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            {feedback.msg}
          </div>
        )}

        <div css={headerStyles}>
          <div>
            <h1 css={titleStyles}>Gerenciar Estabelecimentos</h1>
          </div>
          <button css={newBtnStyles} onClick={novoEstabelecimento}>
            + Novo estabelecimento
          </button>
        </div>

        <div css={layoutStyles}>

          {/* ── Lista ── */}
          <div css={panelStyles}>
            <div css={toolbarStyles}>
              <input
                css={searchStyles}
                placeholder="Buscar por nome, cidade ou usuário..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {['todos', 'pendente', 'aprovado', 'rejeitado'].map((f) => (
                <button key={f} css={filterBtnStyles(filtro === f)} onClick={() => setFiltro(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)} ({contagem[f] ?? 0})
                </button>
              ))}
            </div>

            {loading ? (
              <div css={emptyStyles}>Carregando...</div>
            ) : listagem.length === 0 ? (
              <div css={emptyStyles}>Nenhum estabelecimento encontrado.</div>
            ) : (
              <table css={tableStyles}>
                <thead>
                  <tr>
                    <th css={thStyles}>Nome do estabelecimento</th>
                    <th css={thStyles}>Cidade</th>
                    <th css={thStyles}>Rede social</th>
                    <th css={thStyles}>Sugerido por</th>
                    <th css={thStyles}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listagem.map((item) => (
                    <tr
                      key={item.estabelecimento_id}
                      css={trStyles(selecionado?.estabelecimento_id === item.estabelecimento_id)}
                      onClick={() => selecionarItem(item)}
                    >
                      <td css={tdStyles} style={{ fontWeight: 500 }}>{item.nome}</td>
                      <td css={tdStyles}>{item.cidade}</td>
                      <td css={tdStyles} style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
                        {item.rede_social || '—'}
                      </td>
                      <td css={tdStyles} style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
                        {item.sugerido_por || '—'}
                      </td>
                      <td css={tdStyles}>
                        <span css={badgeStyles(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Formulário ── */}
          {formAberto ? (
            <div css={formPanelStyles}>
              <div css={formHeaderStyles}>
                <div>
                  <div css={formTitleStyles}>
                    {isNovo ? 'Novo estabelecimento' : 'Completar cadastro'}
                  </div>
                  <div css={formSubtitleStyles}>
                    {isNovo
                      ? 'Cadastro direto pelo administrador.'
                      : 'Finalize os campos obrigatórios para aprovação.'}
                  </div>
                </div>
                {selecionado && (
                  <span css={badgeStyles(selecionado.status)}>
                    {selecionado.status.charAt(0).toUpperCase() + selecionado.status.slice(1)}
                  </span>
                )}
              </div>

              <div css={formBodyFormStyles}>
                <div css={rowFieldStyles}>
                  <div css={fieldGroupStyles}>
                    <label>Nome *</label>
                    <input placeholder="Ex: Café Aurora" value={form.nome} onChange={set('nome')} />
                  </div>
                  <div css={fieldGroupStyles}>
                    <label>Cidade *</label>
                    <input placeholder="Ex: Porto Alegre" value={form.cidade} onChange={set('cidade')} />
                  </div>
                </div>

                <div css={fieldGroupStyles}>
                  <label>Rede social *</label>
                  <input placeholder="@usuario" value={form.redeSocial} onChange={set('redeSocial')} />
                </div>

                <div css={fieldGroupStyles}>
                  <label>Usuário que sugeriu</label>
                  <input
                    placeholder={isNovo ? 'Deixe vazio para cadastro admin' : '@usuario'}
                    value={form.sugeridoPor}
                    onChange={set('sugeridoPor')}
                  />
                </div>

                <div css={fieldGroupStyles}>
                  <label>Endereço *</label>
                  <input placeholder="Rua, número, complemento" value={form.endereco} onChange={set('endereco')} />
                </div>

                <div css={rowFieldStyles}>
                  <div css={fieldGroupStyles}>
                    <label>Categoria principal *</label>
                    <select value={form.categoriaPrincipal} onChange={set('categoriaPrincipal')}>
                      <option value="">Selecionar</option>
                      {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div css={fieldGroupStyles}>
                    <label>Categoria secundária</label>
                    <select value={form.categoriaSecundaria} onChange={set('categoriaSecundaria')}>
                      <option value="">Selecionar</option>
                      {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div css={rowFieldStyles}>
                  <div css={fieldGroupStyles}>
                    <label>Bairro *</label>
                    <input placeholder="Ex: Cidade Baixa" value={form.bairro} onChange={set('bairro')} />
                  </div>
                  <div css={fieldGroupStyles}>
                    <label>País</label>
                    <input value={form.pais} onChange={set('pais')} />
                  </div>
                </div>

                <div css={rowFieldStyles}>
                  <div css={fieldGroupStyles}>
                    <label>Latitude *</label>
                    <input placeholder="-30.0346" value={form.latitude} onChange={set('latitude')} />
                  </div>
                  <div css={fieldGroupStyles}>
                    <label>Longitude *</label>
                    <input placeholder="-51.2177" value={form.longitude} onChange={set('longitude')} />
                  </div>
                </div>
                <p css={coordHintStyles}>
                  Dica: use Google Maps → clique com o botão direito sobre o local → copie as coordenadas.
                </p>
              </div>

              <div css={formActionsStyles}>
                {!isNovo && (
                  <button css={btnRejectStyles} disabled={saving} onClick={() => salvar('rejeitado')}>
                    Rejeitar
                  </button>
                )}
                <button css={btnDraftStyles} disabled={saving} onClick={() => salvar('rascunho')}>
                  Salvar rascunho
                </button>
                <button css={btnApproveStyles} disabled={saving} onClick={() => salvar('aprovado')}>
                  {saving ? 'Salvando...' : 'Aprovar e publicar'}
                </button>
              </div>
            </div>
          ) : (
            <div css={[panelStyles, formPanelStyles]}>
              <div css={emptyPanelStyles}>
                <span style={{ fontSize: 32 }}>🏳️‍🌈</span>
                <span>Selecione um estabelecimento para revisar ou clique em <strong>Novo estabelecimento</strong>.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}