import Layout, { siteTitle } from '../components/layout'
import styles from '../styles/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import urlStyles from '../styles/url.module.css'
import Link from 'next/link'
import Image from 'next/image'

import { getSortedPostsData } from '../libs/posts'
import RequestFormAndResult from '../components/search-form'

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
      <div className={styles.headerTitle}>
        <Image
          priority
          src="/images/profile.jpg"
          height={300}
          width={300}
          alt={name}
        />
      </div>
      <RequestFormAndResult/>
      <div className={`${styles.headerBody} ${utilStyles.headingSmall} ${utilStyles.padding1px}`}>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, title, url }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={url}>
                  <a className={urlStyles.originURL}>
                    <Image
                      priority
                      src={'/images/' + id+ '.jpg'}
                      height={300}
                      width={300}
                      alt={title}
                    />
                  </a>
                </Link>
              </li>
            ))}
          </ul>
      </div>
    </Layout>
  )
}
