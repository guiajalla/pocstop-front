import React from 'react'
import { css } from '@emotion/react'


const footerStyles = css`
    display: flex;
    width: 100%;
    height: 100%;
    padding: 6rem;
    background-color: green;
    `

export const Footer = () => {
    return (
        <div css={footerStyles}></div>
    )
}