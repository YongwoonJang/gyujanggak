import Layout from '/components/layout'
import RequestFormAndResult from '/components/search-form'

import mainPageStyles from '/styles/mainPage.module.css'

import Link from 'next/link'
import Image from 'next/image'

const name = 'Yongwoon Jang Homepage'

export default function Home() {
  
  const allPostsData = [
    { "id": "yongwoonJang", "title": "개인설명", "url": "/posts/profile" },
    { "id": "politics", "title":"정치", "url": "/posts/politics"},
    { "id": "hobby", "title":"취미", "url": "/posts/hobby"}
  ]

  return (
    <Layout>
      <div className={mainPageStyles.titleImage}>
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
      <div>
          <ul className={mainPageStyles.list}>
            {allPostsData.map(({ id, title, url }) => (
              <li className={mainPageStyles.listItem} key={id}>
                  <div className={mainPageStyles.image}>
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
