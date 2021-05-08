import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import styles from '../styles/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import urlStyles from '../styles/url.module.css'
import formStyles from '../styles/form.module.css'
import bodyStyles from '../styles/body.module.css'
import Link from 'next/link'

import { getSortedPostsData } from '../libs/posts'
import Form from '../components/search-form'


const name = '국회정보통합검색시스템'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <br />
      <div className={`${styles.headerleft} ${utilStyles.headingmd} ${utilStyles.padding1px}`}>
          <ul className={utilStyles.list}>
            {allPostsData.slice(0,3).map(({ id, title, url}) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={url}>
                  <a className={urlStyles.originURL}>{title}</a>
                </Link>
                <Link href={url}>
                  <a className={urlStyles.originURL}>(원본 페이지)</a>
                </Link>
              </li>
            ))}
          </ul>
      </div>
      <div className={styles.headercenter}>
        <h1 className={utilStyles.headingLg}>{name}</h1>
      </div>
      <div className={`${styles.headerright} ${utilStyles.headingSmall} ${utilStyles.padding1px}`}>
          <ul className={utilStyles.list}>
            {allPostsData.slice(3,8).map(({ id, title, url }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={url}>
                  <a className={urlStyles.originURL}>{title}</a>
                </Link>
                <Link href={url}>
                  <a className={urlStyles.originURL}>(원본 페이지)</a>
                </Link>
              </li>
            ))}
          </ul>
      </div>
      <div className={formStyles.form}>
        <Form />
      </div>
      <div className={bodyStyles.bodyHead}>
        <div>누가</div>
        <div>언제</div>
        <div>어디서</div>
        <div>무엇을</div>
        <div>어떻게</div>
        <div>왜</div>
      </div>
    </Layout>
  )
}
