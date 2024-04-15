import { Content } from './components/content'
import { Footer } from './components/footer'
import { Header } from './components/header'
import { css } from '@emotion/react'

const AppStyles = css`
  display: flex;
  flex-direction: column;
`

const App = () => {
  return (
    <>
      <div css={AppStyles}>
        <Header />
        <Content />
        <Footer />
      </div>
    </>
  )
}

export default App
