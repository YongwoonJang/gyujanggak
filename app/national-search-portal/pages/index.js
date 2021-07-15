import Layout from '../components/layout'
import styles from '../styles/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import urlStyles from '../styles/url.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { getSortedPostsData } from '../libs/posts'
import RequestFormAndResult from '../components/search-form'

const name = '국회정보통합검색시스템'

export async function getStaticProps() {
  const allPostsData = [
    { "id": "InspectOfStateAdministration", "title": "국정감사정보", "url": "https://likms.assembly.go.kr/inspections/main.do" },
    { "id": "NationalAssemblyLawInformation", "title": "국회법률정보", "url": "http://likms.assembly.go.kr/law/lawsNormInqyMain1010.do?mappingId=%2FlawsNormInqyMain1010.do&genActiontypeCd=2ACT1010" },
    { "id": "NationalAssemblyMinuttes", "title": "국회회의록", "url": "http://likms.assembly.go.kr/record/index.jsp" },
    { "id": "PersonalizedLegislative", "title": "의안 회의록", "url": "http://naph.assembly.go.kr/index.jsp" },
    { "id": "OpenCongress", "title": "열려라 국회", "url": "http://watch.peoplepower21.org/home" },
    { "id": "BudgetSettlementInfo", "title": "예결산정보시스템", "url": "http://likms.assembly.go.kr/bill/nafs/nafsList.do" },
    { "id": "BillInfo", "title": "의안정보", "url": "http://likms.assembly.go.kr/bill/main.do" }
  ]
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
