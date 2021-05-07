import Head from 'next/head'
import styles from '../styles/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { getSortedPostsData } from '../libs/posts'
import Form from './search-form'

export const siteTitle = 'Gyujanggak project'
const name = '국회정보통합검색시스템'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
export default function Layout() {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="Gyujanggak project"
          content="국회 자료를 잘 찾을 수 있도록 도와줍니다."
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        <div className={`${styles.headerleft} ${utilStyles.headingmd} ${utilStyles.padding1px}`}>
            <ul className={utilStyles.list}>
              {allPostsData[0,2].map(({ id, title, url}) => (
                <li className={utilStyles.listItem} key={id}>
                  <Link href={`.../pages/posts/${id}`}>
                    <a>{title}</a>
                  </Link>
                  <Link href={url}>
                    <a className={urlStyles.originURL}>(원본 페이지)</a>
                  </Link>
                  <br />
                </li>
              ))}
            </ul>
        </div>
        <div className={styles.headercenter}>
          <h1 className={utilStyles.heading2Xl}>{name}</h1>
          <Form />
        </div>
        <div className={`${styles.headerright} ${utilStyles.headingmd} ${utilStyles.padding1px}`}>
            <ul className={utilStyles.list}>
              {allPostsData.slice(4,8).map(({ id, title, url }) => (
                <li className={utilStyles.listItem} key={id}>
                  <Link href={url}>
                    <a className={urlStyles.originURL}>{title}</a>
                  </Link>
                  <br />
                </li>
              ))}
            </ul>
        </div>
      </header>
    </div>
  )
}
