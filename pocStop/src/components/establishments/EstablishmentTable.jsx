import {
  panelStyles, toolbarStyles, searchStyles, filterBtnStyles,
  tableStyles, thStyles, trStyles, tdStyles, badgeStyles, emptyStyles,
} from './establishmentStyles'
const FILTROS = ['todos', 'pendente', 'aprovado', 'rejeitado']

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const EstablishmentTable = ({ listagem, contagem, selecionado, loading, busca, filtro, onBusca, onFiltro, onSelect }) => (
  <div css={panelStyles}>
    <div css={toolbarStyles}>
      <input
        css={searchStyles}
        placeholder="Buscar por nome, cidade, estado ou usuário..."
        value={busca}
        onChange={(e) => onBusca(e.target.value)}
      />
      {FILTROS.map((f) => (
        <button key={f} css={filterBtnStyles(filtro === f)} onClick={() => onFiltro(f)}>
          {capitalize(f)} ({contagem[f] ?? 0})
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
            <th css={thStyles}>Cidade / Estado</th>
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
              onClick={() => onSelect(item)}
            >
              <td css={tdStyles} style={{ fontWeight: 500 }}>{item.nome}</td>
              <td css={tdStyles}>{item.cidade}{item.estado ? `/${item.estado}` : ''}</td>
              <td css={tdStyles} style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
                {item.rede_social || '—'}
              </td>
              <td css={tdStyles} style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
                {item.sugerido_por || '—'}
              </td>
              <td css={tdStyles}>
                <span css={badgeStyles(item.status)}>{capitalize(item.status)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)
