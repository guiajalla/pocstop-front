import React from 'react'
import { css } from '@emotion/react'


const contentStyles = css`
    display: flex;
    align-items: center;
    `

const contentTextStyle = css``

const imageStyle = css`
    width: 50%;
    height: 50%;
    z-index: -1
`

export const Content = () => {
    return (
        <div css={contentStyles}>
            <div>
                <h1>POCSTOP</h1>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                 Maecenas sit amet pretium urna. Vivamus venenatis velit nec neque ultricies,
                eget elementum magna tristique.
                </p>
            </div>
                <img src='../../../quack.svg' alt='duck' css={imageStyle} />

        </div>
    )
}