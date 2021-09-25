import '/styles/global.css'
import '/styles/page.module.scss'

export default function App({ Component, pageProps }) {
  return (
  <>
    <Component {...pageProps} />
  </>
  )
}
