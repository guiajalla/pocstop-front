import React, { useCallback }  from "react"
import { css } from '@emotion/react'

const buttonStyles = css`
    &:hover {
        color: white;
    }
    background-color: transparent;
    border: none;
`

export const Button = ({text}) => {
    const onClick = useCallback(() => {
        console.log("Vite + React + TypeScript + Tailwind = ❤️");
      }, []);
      
    return (
        <button css={buttonStyles} onClick={onClick}>{text}</button>
    )
}