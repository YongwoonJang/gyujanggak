import Link from 'next/link'
import Image from 'next/image'
import Layout from '/components/layout'
import RequestFormAndResult from '/components/searchForm'
import mainPageStyles from '/styles/mainPage.module.css'

export default function Home() {
  
  const name = 'Yongwoon Jang Homepage'

  const allPostsData = [
    { "id": "yongwoonJang", "title": "개인설명", "url": "/posts/profile" },
    { "id": "politics", "title":"정치", "url": "/posts/politics"},
    { "id": "hobby", "title":"취미", "url": "/posts/hobby"},
    { "id": "communication", "title":"소통","url":"/posts/communication"}
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
      <ul className={mainPageStyles.mainMenuList}>
        {allPostsData.map(({ id, title, url }) => (
            <li key={id} className={mainPageStyles.mainMenuListItems}>
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
              </li>
        ))}
      </ul>
    </Layout>
  )
}
