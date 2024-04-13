import React from 'react'
import { css } from '@emotion/react'


const headerStyles = css`
    display: flex;
    width: 100%;
    height: 100%;
    padding: 3rem;
    background-color: red;
    `

export const Header = () => {
    return (
        <div css={headerStyles}></div>
    )
}