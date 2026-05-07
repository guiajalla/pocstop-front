import React from 'react'
import { css } from '@emotion/react'
import { useNavigate } from 'react-router-dom'

const footerWrap = css`
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  @media (max-width: 600px) { flex-direction: column; gap: 12px; text-align: center; }
`

const footerCopy = css`
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
`

const footerLinks = css`
  display: flex;
  gap: 20px;
`

const footerLink = css`
  background: none;
  border: none;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  transition: color 0.15s;
  &:hover { color: #111827; }
`

export const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer css={footerWrap}>
      <p css={footerCopy}>© 2025 PocStop — Mapa colaborativo de locais e experiências.</p>
      <div css={footerLinks}>
        <button css={footerLink} onClick={() => navigate('/perfil')}>Meu perfil</button>
        <button css={footerLink}>Minhas avaliações</button>
        <button css={footerLink}>Privacidade</button>
      </div>
    </footer>
  )
}
