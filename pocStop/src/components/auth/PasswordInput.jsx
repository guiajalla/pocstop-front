import { useState } from 'react'
import { passwordWrapStyles, eyeBtnStyles } from './authStyles'

export const PasswordInput = ({ placeholder, value, onChange }) => {
  const [show, setShow] = useState(false)
  return (
    <div css={passwordWrapStyles}>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <button type="button" css={eyeBtnStyles} onClick={() => setShow((s) => !s)}>
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  )
}
