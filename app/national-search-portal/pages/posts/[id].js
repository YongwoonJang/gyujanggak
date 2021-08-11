import fs from 'fs'
import matter from 'gray-matter'
import parse from 'html-react-parser'
import Image from 'next/image'
import styles from '/styles/layout.module.css'
import utilStyles from '/styles/utils.module.css'
import urlStyles from '/styles/url.module.css'
import indexPageStyles from '/styles/indexPage.module.css'
import Link from 'next/link'

export default function Post({id, data, contents}){
    const content = parse(contents)
    const politicsList = [
        { "id": "InspectOfStateAdministration", "title": "국정감사정보", "url": "https://likms.assembly.go.kr/inspections/main.do" },
        { "id": "NationalAssemblyLawInformation", "title": "국회법률정보", "url": "http://likms.assembly.go.kr/law/lawsNormInqyMain1010.do?mappingId=%2FlawsNormInqyMain1010.do&genActiontypeCd=2ACT1010" },
        { "id": "NationalAssemblyMinutes", "title": "국회회의록", "url": "http://likms.assembly.go.kr/record/index.jsp" },
        { "id": "PersonalizedLegislative", "title": "의안 회의록", "url": "http://naph.assembly.go.kr/index.jsp" },
        { "id": "OpenCongress", "title": "열려라 국회", "url": "http://watch.peoplepower21.org/home" },
        { "id": "BudgetSettlementInfo", "title": "예결산정보시스템", "url": "http://likms.assembly.go.kr/bill/nafs/nafsList.do" },
        { "id": "BillInfo", "title": "의안정보", "url": "http://likms.assembly.go.kr/bill/main.do" }
    ]
    if(id == 'profile'){
        return (
            <>
                <div className={indexPageStyles.indexPage} style={{ paddingLeft: 20 + 'px' }}>
                    <h1 >{data.title}</h1>
                    <h2>{data.date}</h2>
                    <h3>{data.author.name}</h3>
                    <div className={indexPageStyles.indexImage}>
                        <Image className={indexPageStyles.Image} width={200} height={200} src={"/images/20210807Yongwoon.jpg"} alt="My profile" />
                    </div>
                    <div>{content}</div>
                </div>
            </>
        )
    }else if(id == 'politics'){
        return (
            <>
                <div style={{ paddingLeft: 20 + 'px' }}>
                    <h1>{data.title}</h1>
                    <h2>{data.date}</h2>
                    <h3>{data.author.name}</h3>
                    <div>{content}</div>
                </div>
                <div className={`${styles.headerBody} ${utilStyles.headingSmall} ${utilStyles.padding1px}`}>
                    <ul className={utilStyles.list}>
                        {politicsList.map(({ id, title, url }) => (
                            <li className={utilStyles.listItem} key={id}>
                                <Link href={url}>
                                    <a className={urlStyles.originURL}>
                                        <Image
                                            priority
                                            src={'/images/' + id + '.jpg'}
                                            height={200}
                                            width={200}
                                            alt={title}
                                        />
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        )
    }else{
        return (
            <>
                <div style={{ paddingLeft: 20 + 'px' }}>
                    <h1>{data.title}</h1>
                    <h2>{data.date}</h2>
                    <h3>{data.author.name}</h3>
                    <div className={utilStyles.danceFrame}>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/fYXFJ9YxUQs?start=8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br />
                        2007년부터 춤을 추었습니다. <br />
                    </div>
                    <div className={utilStyles.pianoFrame}>
                        1997년부터 피아노를 배웠습니다. <br />
                        오랜기간 쉬고 2018년부터 다시 배우기 시작했습니다.<br />
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/Srw3r_QA0RY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            </>
        )
    }
    
}

export function getStaticPaths(){
    const postNames = ["profile", "politics","fun"]
  
    const params = postNames.map((postName) => ({
        params: { id: postName  }
    })) 

    return {paths: params, fallback: 'blocking'}
}

export async function getStaticProps({ params }){
    const fullPath = "public/posts/"+params.id+".md"
    const fileContent = fs.readFileSync(fullPath)
    
    const matterResult = matter(fileContent)
    return {
        props: {
            id : params.id,
            data : matterResult.data,
            contents : matterResult.content
        },
    }
}
