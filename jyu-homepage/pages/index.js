import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
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
    <>
      <Head>
        <title>"YongwoonJang's Creative Home"</title>
        <meta property="og:url" content="https://gyujanggak.vercel.app"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="YongwoonJang's Creative Home" />
        <meta property="og:description" content="피아노, 프로그래밍, 플라모델, 수영, 영어를 사랑하는 서울사는 장용운의 이야기입니다."/>
        <meta property="og:image" content="https://gyujanggak.vercel.app/profile.png" />
        <meta property="og:image:secure_url" content="https://gyujanggak.vercel.app/profile.png" />
        <meta name="keywords" content={"책, 프로그래밍, 플라모델, 수영, 영어"} />
      </Head>
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
    </>
  )
}
