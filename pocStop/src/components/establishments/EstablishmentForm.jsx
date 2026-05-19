import { useState, useEffect } from 'react'
import {
  formPanelStyles, formHeaderStyles, formTitleStyles, formSubtitleStyles,
  formBodyFormStyles, formActionsStyles, fieldGroupStyles, rowFieldStyles,
  badgeStyles, btnRejectStyles, btnDraftStyles, btnApproveStyles,
  coordHintStyles, panelStyles, emptyPanelStyles,
} from './establishmentStyles'
import { CATEGORIAS, ESTADOS_BR, emptyForm } from './establishmentConstants'

export const EstablishmentForm = ({ initialValues, isNovo, selecionado, saving, onSave }) => {
  const [form, setForm] = useState(initialValues ?? emptyForm())
  const [showModalRejeitar, setShowModalRejeitar] = useState(false)
  const [motivo, setMotivo] = useState('')

  useEffect(() => {
    setForm(initialValues ?? emptyForm())
  }, [initialValues])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const abrirModalRejeitar = () => {
    setMotivo(form.observacao || '')
    setShowModalRejeitar(true)
  }

  const confirmarRejeicao = () => {
    setShowModalRejeitar(false)
    onSave('rejeitado', { ...form, observacao: motivo.trim() })
  }

  if (!selecionado && !isNovo) {
    return (
      <div css={[panelStyles, formPanelStyles]}>
        <div css={emptyPanelStyles}>
          <span style={{ fontSize: 32 }}>🏳️‍🌈</span>
          <span>Selecione um estabelecimento para revisar ou clique em <strong>Novo estabelecimento</strong>.</span>
        </div>
      </div>
    )
  }

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <>
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
          <span css={badgeStyles(selecionado.status)}>{capitalize(selecionado.status)}</span>
        )}
      </div>

      <div css={formBodyFormStyles}>
        <div css={fieldGroupStyles}>
          <label>Nome *</label>
          <input placeholder="Ex: Café Aurora" value={form.nome} onChange={set('nome')} />
        </div>

        <div css={rowFieldStyles}>
          <div css={fieldGroupStyles}>
            <label>Cidade *</label>
            <input placeholder="Ex: Porto Alegre" value={form.cidade} onChange={set('cidade')} />
          </div>
          <div css={fieldGroupStyles}>
            <label>Estado *</label>
            <select value={form.estado} onChange={set('estado')}>
              <option value="">Selecionar</option>
              {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>
        </div>

        <div css={rowFieldStyles}>
          <div css={fieldGroupStyles}>
            <label>Rede social *</label>
            <input placeholder="@usuario" value={form.redeSocial} onChange={set('redeSocial')} />
          </div>
          <div css={fieldGroupStyles}>
            <label>Link da rede social</label>
            <input placeholder="https://instagram.com/..." value={form.linkRedeSocial} onChange={set('linkRedeSocial')} />
          </div>
        </div>

        <div css={fieldGroupStyles}>
          <label>Usuário que sugeriu</label>
          <input
            placeholder="Sugerido por..."
            value={form.sugeridoPor}
            onChange={isNovo ? set('sugeridoPor') : undefined}
            readOnly={!isNovo}
            style={!isNovo ? { opacity: 0.6, cursor: 'not-allowed', background: '#e8f0e8' } : {}}
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

        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--accent-light)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={form.donoLGBT}
              onChange={(e) => setForm((f) => ({ ...f, donoLGBT: e.target.checked }))}
              style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            🏳️‍🌈 Dono(a) LGBT+
          </label>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, marginLeft: 26 }}>
            Marque se o estabelecimento pertence a uma pessoa LGBT+.
          </p>
        </div>
      </div>

      <div css={formActionsStyles}>
        {!isNovo && selecionado?.status !== 'aprovado' && (
          <button css={btnRejectStyles} disabled={saving} onClick={abrirModalRejeitar}>
            Rejeitar
          </button>
        )}
        <button css={btnDraftStyles} disabled={saving} onClick={() => onSave('rascunho', form)}>
          Salvar rascunho
        </button>
        <button css={btnApproveStyles} disabled={saving} onClick={() => onSave('aprovado', form)}>
          {saving ? 'Salvando...' : 'Aprovar e publicar'}
        </button>
      </div>
    </div>

      {showModalRejeitar && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 24,
          }}
          onClick={() => setShowModalRejeitar(false)}
        >
          <div
            style={{
              background: 'white', borderRadius: 12, width: '100%', maxWidth: 440,
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '18px 22px 14px', borderBottom: '1px solid #fee2e2',
            }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1A3038', fontFamily: "'DM Sans', sans-serif" }}>
                Motivo da recusa
              </h2>
              <button
                onClick={() => setShowModalRejeitar(false)}
                style={{
                  background: 'none', border: 'none', fontSize: 18, color: '#5A7A80',
                  cursor: 'pointer', padding: '2px 6px', borderRadius: 4, lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '18px 22px 22px' }}>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#5A7A80', fontFamily: "'DM Sans', sans-serif" }}>
                Informe o motivo para que o usuário entenda a decisão.
              </p>
              <textarea
                autoFocus
                placeholder="Ex: endereço não encontrado, perfil inativo..."
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                maxLength={280}
                rows={4}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#F3F8F8', border: '1px solid #C2DFE0',
                  borderRadius: 6, padding: '9px 12px',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#1A3038',
                  outline: 'none', resize: 'vertical',
                }}
                onFocus={e => { e.target.style.borderColor = '#3AAFA9'; e.target.style.background = 'white' }}
                onBlur={e => { e.target.style.borderColor = '#C2DFE0'; e.target.style.background = '#F3F8F8' }}
              />
              <span style={{ display: 'block', textAlign: 'right', fontSize: 11, color: '#9ABFC2', marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
                {280 - motivo.length}/280
              </span>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  onClick={() => setShowModalRejeitar(false)}
                  style={{
                    flex: 1, background: 'white', color: '#1A3038',
                    border: '1.5px solid #C2DFE0', borderRadius: 8, padding: '10px',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarRejeicao}
                  disabled={!motivo.trim() || saving}
                  style={{
                    flex: 1, background: motivo.trim() ? '#b91c1c' : '#e5e7eb',
                    color: motivo.trim() ? 'white' : '#9ca3af',
                    border: 'none', borderRadius: 8, padding: '10px',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                    cursor: motivo.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.15s',
                  }}
                >
                  {saving ? 'Rejeitando...' : 'Confirmar recusa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
