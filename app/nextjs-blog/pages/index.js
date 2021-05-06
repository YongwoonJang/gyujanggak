import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../libs/posts'
import Link from 'next/link'
import Date from '../components/date'
import Form from '../components/search-form'

    

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
      <section className={utilStyles.headingMd}>
        <h2 className={utilStyles.headingLg}>
          국회정보시스템 통합 검색 서비스
        </h2>
      </section>
      <section>
        <Form />
      </section>
      <section className={`${utilStyles.headingmd} ${utilStyles.padding1px}`}>
        <ul className={utilStyles.list}>
          {allPostsData.map(({id, date, title,url}) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <Link href={url}>
                <a>Go to original site</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small> 
            </li>
          ))}
        </ul>
        </section>
    </Layout>
  )
}
