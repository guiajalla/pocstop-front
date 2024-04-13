import React from 'react'
import { css } from '@emotion/react'


const contentStyles = css`
    display: flex;
    width: 100%;
    height: 100%;
    padding: 600px;
    background-color: yellow;
    `

export const Content = () => {
    return (
        <div css={contentStyles}></div>
    )
}