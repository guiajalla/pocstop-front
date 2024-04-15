import React from 'react'
import { css } from '@emotion/react'
import { Button } from '../button'


const headerContainer = css`
    display: flex;
    justify-content: space-between;
    background-color: PaleGreen;
    box-shadow: 0px 5px 1rem lightblue;
    img {
        margin-left: 1rem;
        height: 5rem;
    }
    `
const headerButtons = css`
    display: flex;
    margin-right: 1rem;
`

export const Header = () => {
    return (
        <div css={headerContainer}>
            <img src='../../../public\pride.svg' alt='bandeira LGBTQIAPN+'/>
            <div css={headerButtons}>
                <Button text={'Avalie Locais'}/>
                <Button text={'Dashboard'}/>
                <Button text={'Sign Up'}/>
            </div>
        </div>
    )
}