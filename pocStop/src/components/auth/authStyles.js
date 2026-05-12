import { css } from '@emotion/react'

export const globalStyles = css`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --radius: 6px; --error: #c0392b; --success: #006847; }
  body { font-family: 'DM Sans', sans-serif; }
`

export const pageStyles = css`
  min-height: 100vh;
  background-color: #F3F8F8;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 24px 80px;
  font-family: 'DM Sans', sans-serif;
`

export const cardStyles = css`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 5px 1rem #B3C4E8;
  overflow: hidden;
`

export const tabBarStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #D4EEF0;
`

export const tabStyles = (active) => css`
  padding: 16px;
  border: none;
  background: ${active ? 'white' : 'transparent'};
  color: ${active ? '#006847' : '#5A7A80'};
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: ${active ? '600' : '400'};
  cursor: pointer;
  border-bottom: ${active ? '2px solid #3AAFA9' : '2px solid transparent'};
  transition: all 0.2s;
  &:hover { background: ${active ? 'white' : 'rgba(255,255,255,0.5)'}; }
`

export const formBodyStyles = css`padding: 32px;`

export const sectionTitleStyles = css`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #3AAFA9;
  margin: 24px 0 14px;
  padding-bottom: 6px;
  border-bottom: 1px solid #C2DFE0;
  &:first-of-type { margin-top: 0; }
`

export const fieldStyles = css`
  margin-bottom: 14px;
  label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #5A7A80;
    margin-bottom: 6px;
  }
  input, select {
    width: 100%;
    background: #F3F8F8;
    border: 1px solid #C2DFE0;
    border-radius: var(--radius);
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
  }
`

export const passwordWrapStyles = css`
  position: relative;
  input { padding-right: 42px; }
`

export const eyeBtnStyles = css`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #5A7A80;
  font-size: 16px;
  padding: 2px;
  line-height: 1;
  &:hover { color: #006847; }
`

export const rowStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`

export const buttonStyles = css`
  width: 100%;
  background: #D4EEF0;
  color: #1A3038;
  border: none;
  border-radius: var(--radius);
  padding: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 0px 3px 8px #B3C4E8;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

export const errorStyles = css`
  background: rgba(192, 57, 43, 0.08);
  border: 1px solid rgba(192, 57, 43, 0.25);
  border-radius: var(--radius);
  padding: 10px 13px;
  font-size: 13px;
  color: var(--error);
  margin-bottom: 16px;
`

export const successStyles = css`
  background: rgba(0, 104, 71, 0.08);
  border: 1px solid rgba(0, 104, 71, 0.25);
  border-radius: var(--radius);
  padding: 16px;
  font-size: 14px;
  color: var(--success);
  text-align: center;
  line-height: 1.7;
`

export const passwordRulesStyles = css`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const ruleStyles = (ok) => css`
  font-size: 11px;
  color: ${ok ? '#006847' : '#9e9e9e'};
  display: flex;
  align-items: center;
  gap: 5px;
  &::before { content: "${ok ? '✓' : '○'}"; font-weight: 700; }
`

export const codeInputStyles = css`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 24px 0 8px;
  input {
    width: 48px;
    height: 56px;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    background: #F3F8F8;
    border: 1px solid #C2DFE0;
    border-radius: var(--radius);
    color: #1A3038;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s;
    &:focus { border-color: #3AAFA9; background: white; }
  }
`

export const resendStyles = css`
  text-align: center;
  font-size: 12px;
  color: #5A7A80;
  margin-top: 12px;
  button {
    background: none;
    border: none;
    color: #3AAFA9;
    font-size: 12px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    padding: 0;
    &:hover { text-decoration: underline; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
`
