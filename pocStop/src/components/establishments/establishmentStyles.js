import { css } from '@emotion/react'

export const globalStyles = css`
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

export const pageStyles = css`
  min-height: 100vh;
  background: var(--bg);
  padding: 32px;
  @media (max-width: 768px) { padding: 16px; }
`

export const headerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
`

export const titleStyles = css`
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.3px;
`

export const newBtnStyles = css`
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

export const layoutStyles = css`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 20px;
  align-items: start;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`

export const panelStyles = css`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow);
  overflow: hidden;
`

export const toolbarStyles = css`
  display: flex;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
`

export const searchStyles = css`
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

export const filterBtnStyles = (active) => css`
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

export const tableStyles = css`width: 100%; border-collapse: collapse;`

export const thStyles = css`
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

export const trStyles = (selected) => css`
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  background: ${selected ? 'var(--accent-light)' : 'var(--surface)'};
  transition: background 0.12s;
  &:hover { background: var(--accent-light); }
  &:last-child { border-bottom: none; }
`

export const tdStyles = css`padding: 12px 16px; font-size: 13px;`

export const badgeStyles = (status) => {
  const map = {
    pendente:  { bg: 'var(--pending-bg)',  color: 'var(--pending)',  },
    aprovado:  { bg: 'var(--approved-bg)', color: 'var(--approved)', },
    rejeitado: { bg: 'var(--rejected-bg)', color: 'var(--rejected)', },
    rascunho:  { bg: '#f3f4f6',            color: '#6b7280',         },
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

export const emptyStyles = css`
  padding: 48px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
`

export const emptyPanelStyles = css`
  padding: 48px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

export const formPanelStyles = css`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow);
  position: sticky;
  top: 24px;
`

export const formHeaderStyles = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 0;
  margin-bottom: 4px;
`

export const formTitleStyles = css`font-size: 16px; font-weight: 600; color: var(--text);`

export const formSubtitleStyles = css`font-size: 12px; color: var(--text-muted); margin-top: 2px;`

export const formBodyFormStyles = css`
  padding: 16px 20px 20px;
  max-height: 75vh;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`

export const fieldGroupStyles = css`
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

export const rowFieldStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

export const formActionsStyles = css`
  display: flex;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
`

export const btnRejectStyles = css`
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

export const btnDraftStyles = css`
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

export const btnApproveStyles = css`
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

export const coordHintStyles = css`
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
  font-style: italic;
`
