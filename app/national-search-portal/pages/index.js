import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import styles from '../styles/layout.module.css'


export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <br />
      <div className = {styles.container}>
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
