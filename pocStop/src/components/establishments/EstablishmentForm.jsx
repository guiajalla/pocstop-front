import { useState } from 'react'
import {
  formPanelStyles, formHeaderStyles, formTitleStyles, formSubtitleStyles,
  formBodyFormStyles, formActionsStyles, fieldGroupStyles, rowFieldStyles,
  badgeStyles, btnRejectStyles, btnDraftStyles, btnApproveStyles,
  coordHintStyles, panelStyles, emptyPanelStyles,
} from './establishmentStyles'
import { CATEGORIAS, emptyForm } from './establishmentConstants'

export const EstablishmentForm = ({ initialValues, isNovo, selecionado, saving, onSave }) => {
  const [form, setForm] = useState(initialValues ?? emptyForm())

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

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
        {!isNovo && (
          <button css={btnRejectStyles} disabled={saving} onClick={() => onSave('rejeitado', form)}>
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
  )
}
