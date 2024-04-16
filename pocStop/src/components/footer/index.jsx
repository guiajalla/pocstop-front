import React from 'react'
import { css } from '@emotion/react'


const footerStyles = css`
    align-self: end
    display: flex;
    height: 20rem;
    background-color: #6ad969;
    box-shadow: 0px -5px 1rem lightblue;
    `

export const Footer = () => {
    return (
        <div css={footerStyles}></div>
    )
}