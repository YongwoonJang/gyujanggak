import Head from 'next/head'
import styles from '/styles/layout.module.css'

export const siteTitle = 'JYU homepage'

export default function Layout({children}) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="JYU homepage"
          content="장용운을 설명합니다."
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      {children}
    </div >
  )
}
