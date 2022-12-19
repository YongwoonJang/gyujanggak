import Link from 'next/link'
import Image from 'next/image'
import Layout from '/components/layout'
import mainPageStyles from '/styles/mainPage.module.css'

export default function Home() {
  
  const allPostsData = [
    { "id": "yongwoonJang", "title": "개인설명", "url": "/posts/profile" },
    { "id": "community", "title":"공동체", "url": "/posts/community"},
    { "id": "hobby", "title":"취미", "url": "/posts/hobby"},
    { "id": "communication", "title":"소통","url":"/posts/communication"}
  ]

  return (
    <Layout>
      <ul className={mainPageStyles.mainMenuList}>
        {allPostsData.map(({ id, title, url }) => (
          <li key={id} className={mainPageStyles.mainMenuListItems}>
            <Link href={url}>
              <a>
                <Image
                  src={'/images/' + id + '.jpg'}
                  height={300}
                  width={300}
                  alt={title}
                  priority
                />
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
