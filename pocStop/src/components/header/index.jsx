import React from 'react'
import { css } from '@emotion/react'
import { Button } from '../button'


const headerContainer = css`
    display: flex;
    justify-content: space-between;

    width: 100%;
    height: 100%;
    padding: 3rem;
    background-color: PaleGreen;

    img {
        height: 10rem;
    }
    `
const headerButton = css`
    display: flex;
`

export const Header = () => {
    return (
        <div css={headerContainer}>
            <img src='../../../public\pride.svg' alt='bandeira LGBTQIAPN+'/>
            <div css={headerButton}>
                <Button text={'Avalie Locais'}/>
                <Button text={'Dashboard'}/>
                <Button text={'Sign Up'}/>
            </div>
        </div>
    )
}