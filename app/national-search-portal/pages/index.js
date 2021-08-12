import Layout from '../components/layout'
import styles from '../styles/layout.module.css'
import utilStyles from '../styles/mainUtils.module.css'
import Link from 'next/link'
import Image from 'next/image'
import RequestFormAndResult from '../components/search-form'

const name = '국회정보통합검색시스템'

export default function Home() {
  
  const allPostsData = [
    { "id": "yongwoonJang", "title": "개인설명", "url": "/posts/profile" },
    { "id": "politics", "title":"정치", "url": "/posts/politics"},
    { "id": "hobby", "title":"취미", "url": "/posts/hobby"}
  ]

  return (
    <Layout>
      <div className={styles.headerTitle}>
        <a href="https://gyujanggak.vercel.app">
          <Image
            priority
            src="/images/profile.jpg"
            height={300}
            width={300}
            alt={name}
          />
        </a>
      </div>
      <RequestFormAndResult/>
      <div className={`${styles.headerBody} ${utilStyles.headingSmall} ${utilStyles.padding1px}`}>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, title, url }) => (
              <li className={utilStyles.listItem} key={id}>
                  <div className={utilStyles.image}>
                    <Link href={url}>
                      <a>
                        <Image
                          priority
                          src={'/images/' + id+ '.jpg'}
                          height={350}
                          width={350}
                          alt={title}
                        />
                      </a>
                    </Link>
                  </div>
              </li>
            ))}
          </ul>
      </div>
    </Layout>
  )
}
