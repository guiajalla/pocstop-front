import React, { useState, useRef, useEffect } from 'react'
import { css } from '@emotion/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const headerContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #D4EEF0;
  box-shadow: 0px 5px 1rem #B3C4E8;
  position: relative;
  z-index: 100;
  img {
    margin-left: 1rem;
    height: 5rem;
    max-width: 40vw;
    object-fit: contain;
    cursor: pointer;
  }
  @media (max-width: 480px) {
    img {
      height: 3rem;
      max-width: 35vw;
    }
  }
`

const headerButtons = css`
  display: flex;
  margin-right: 1rem;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`

const btnStyles = css`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-family: sans-serif;
  transition: background 0.2s;
  &:hover { color: white; }
`

const explorarBtnStyles = css`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-family: sans-serif;
  color: #1A3038;
  transition: background 0.2s;
  &:hover { background: rgba(0,0,0,0.08); }
  @media (max-width: 480px) {
    display: none;
  }
`

const adminBtnStyles = css`
  ${btnStyles};
  font-size: 0.85rem;
  font-weight: 600;
  color: #2B6078;
  border: 1px solid #2B6078;
  &:hover { background: #2B6078; color: white; }
`

// Wrapper do dropdown do usuário
const dropdownWrapperStyles = css`
  position: relative;
`

const userBtnStyles = css`
  background: rgba(0,0,0,0.08);
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-family: sans-serif;
  color: #1A3038;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
  &:hover { background: rgba(0,0,0,0.15); }
`

const chevronStyles = (open) => css`
  font-size: 10px;
  transition: transform 0.2s;
  transform: ${open ? 'rotate(180deg)' : 'rotate(0deg)'};
  display: inline-block;
`

const dropdownStyles = css`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border: 1px solid #C0D8E8;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  min-width: 200px;
  overflow: hidden;
  z-index: 200;
`

const dropdownHeaderStyles = css`
  padding: 12px 16px;
  border-bottom: 1px solid #E0F5F3;
  background: #F3F8F8;
`

const dropdownEmailStyles = css`
  font-size: 12px;
  color: #5A7A80;
  font-family: sans-serif;
  word-break: break-all;
`

const dropdownItemStyles = css`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-family: sans-serif;
  color: #1A3038;
  text-align: left;
  transition: background 0.15s;
  &:hover { background: #F3F8F8; }
`

const dropdownDividerStyles = css`
  height: 1px;
  background: #E0F5F3;
  margin: 4px 0;
`

const dropdownLogoutStyles = css`
  ${dropdownItemStyles};
  color: #b91c1c;
  &:hover { background: #fee2e2; }
`

export const Header = () => {
  const { user, perfil, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
    navigate('/')
  }

  const handleNav = (path) => {
    setDropdownOpen(false)
    navigate(path)
  }

  const email = user?.signInDetails?.loginId || user?.username || ''

  return (
    <div css={headerContainer}>
      <img src='../../../pride.svg' alt='bandeira LGBTQIAPN+' onClick={() => navigate('/')} />

      <div css={headerButtons}>
        <button css={explorarBtnStyles} onClick={() => navigate('/')}>Explorar mapa</button>
        {user ? (
          <>
            {/* Dropdown do usuário */}
            <div css={dropdownWrapperStyles} ref={dropdownRef}>
              <button css={userBtnStyles} onClick={() => setDropdownOpen((o) => !o)}>
                {email}
                <span css={chevronStyles(dropdownOpen)}>▾</span>
              </button>

              {dropdownOpen && (
                <div css={dropdownStyles}>
                  <div css={dropdownHeaderStyles}>
                    <div css={dropdownEmailStyles}>{email}</div>
                  </div>

                  {!isAdmin && (
                    <>
                      <button css={dropdownItemStyles} onClick={() => handleNav('/perfil')}>
                        👤 Meu perfil
                      </button>
                      <button css={dropdownItemStyles} onClick={() => handleNav('/sugerir')}>
                        + Sugerir estabelecimento
                      </button>
                      <div css={dropdownDividerStyles} />
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <button css={dropdownItemStyles} onClick={() => handleNav('/admin/estabelecimentos')}>
                        ⚙ Gerenciar estabelecimentos
                      </button>
                      <div css={dropdownDividerStyles} />
                    </>
                  )}

                  <button css={dropdownLogoutStyles} onClick={handleLogout}>
                    ↩ Sair
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button css={btnStyles} onClick={() => navigate('/auth')}>Entrar</button>
        )}
      </div>
    </div>
  )
}