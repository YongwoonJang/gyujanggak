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
        { "id": "inspectOfStateAdministration", "title": "국정감사정보", "url": "https://likms.assembly.go.kr/inspections/main.do" },
        { "id": "nationalAssemblyLawInformation", "title": "국회법률정보", "url": "http://likms.assembly.go.kr/law/lawsNormInqyMain1010.do?mappingId=%2FlawsNormInqyMain1010.do&genActiontypeCd=2ACT1010" },
        { "id": "nationalAssemblyMinutes", "title": "국회회의록", "url": "http://likms.assembly.go.kr/record/index.jsp" },
        { "id": "personalizedLegislative", "title": "의안 회의록", "url": "http://naph.assembly.go.kr/index.jsp" },
        { "id": "openCongress", "title": "열려라 국회", "url": "http://watch.peoplepower21.org/home" },
        { "id": "budgetSettlementInfo", "title": "예결산정보시스템", "url": "http://likms.assembly.go.kr/bill/nafs/nafsList.do" },
        { "id": "billInfo", "title": "의안정보", "url": "http://likms.assembly.go.kr/bill/main.do" }
    ]
    if(id == 'profile'){
        return (
            <>
                <div className={indexPageStyles.indexPage} style={{ paddingLeft: 20 + 'px' }}>
                    <h2 style={{ backgroundColor: "cyan", marginTop: 0.5+"em"}}>{data.date}, { data.author.name }</h2>
                    <div>
                        <div className={indexPageStyles.indexImage} style={{ width: 30 + "%" }}>
                            <Image className={indexPageStyles.Image} width={200} height={200} src={"/images/20210807Yongwoon.jpg"} alt="My profile" />
                        </div>
                        <div style={{ display: "inline"}}>
                            {content}
                        </div>
                        
                    </div>
                </div>
            </>
        )
    }else if(id == 'politics'){
        return (
            <>
                <div className={indexPageStyles.indexPage}style={{ paddingLeft: 26 + 'px' }}>
                    <div style={{textAlign:"right"}}>
                        <h1 style={{ backgroundColor: 'yellow', width:250+"px",display: "inline-block", textAlign: "left", marginRight: "0" + 'em', marginBottom: 0.2 + "em"}}>{data.title}</h1>
                    </div>
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
                    <div style={{ textAlign:'right', marginRight: 100 + 'px'}}>
                        <h1 style={{ backgroundColor: "cyan"}}>{data.title}</h1>
                        <h2>{data.date}</h2>
                        <h3>{data.author.name}</h3>
                    </div>
                    <div className={utilStyles.danceFrame}>
                        <div>2007년부터 춤을 추었습니다.</div>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/fYXFJ9YxUQs?start=8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br />
                    </div>
                    <div className={utilStyles.pianoFrame}>
                        <div>1997년부터 피아노를 배웠습니다.<br />
                        오랜기간 쉬고 2018년부터 다시 배우기 시작했습니다.</div>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/Srw3r_QA0RY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            </>
        )
    }
    
}

export function getStaticPaths(){
    const postNames = ["profile", "politics","hobby"]
  
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
