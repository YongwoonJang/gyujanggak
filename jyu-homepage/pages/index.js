import Head from 'next/head'
import Main from './main'


export default function Home() {
  
  const allPostsData = [
    { "id": "yongwoonJang", "title": "개인설명", "url": "/posts/profile" },
    { "id": "community", "title":"공동체", "url": "/posts/community"},
    { "id": "newHobby", "title":"취미", "url": "/posts/hobby"},
    { "id": "communication", "title":"소통","url":"/posts/communication"}
  ]

  return (
    <>
      <Head>
        <title>"THE Archive"</title>
        <meta property="og:url" content="https://gyujanggak.vercel.app"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="장용운의 Archive" />
        <meta property="og:description" content="Artist & IT service manager"/>
        <meta property="og:image" content="https://gyujanggak.vercel.app/profile.png" />
        <meta property="og:image:secure_url" content="https://gyujanggak.vercel.app/profile.png" />
        <meta name="keywords" content={"책, 프로그래밍, 피아노, 음악"} />
      </Head>
      <Main/>
    </>
  )
}
