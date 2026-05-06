import React from 'react'
import { css } from '@emotion/react'

const buttonStyles = css`
  &:hover {
    color: white;
  }
  background-color: transparent;
  border: none;
  cursor: pointer;
`

export const Button = ({ text, onClick }) => {
  return (
    <button css={buttonStyles} onClick={onClick}>
      {text}
    </button>
  )
}