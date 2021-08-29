import fs from 'fs'
import matter from 'gray-matter'
import parse from 'html-react-parser'

import Image from 'next/image'
import Link from 'next/link'
import pageStyles from '/styles/page.module.scss'

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
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.profileTitle}>{data.title}</h1>
                    <div className={pageStyles.profileImage}>
                        <Image layout="intrinsic" width="300px" height="300px" src={"/images/20210807Yongwoon.jpg"} alt="My profile" />
                    </div>
                    {content}
                </div>
            </>
        )
    }else if(id == 'politics'){
        return (
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.politicsTitle}>{data.title}</h1>
                    {content}
                </div>
                <ul className={pageStyles.politicsImageList}>
                    {politicsList.map(({ id, title, url }) => (
                        <li key={id} className={pageStyles.politicsImage}>
                            <Link href={url}>
                                <a>
                                    <Image
                                        priority
                                        layout="intrinsic"
                                        src={'/images/' + id + '.jpg'}
                                        height="200px"
                                        width="200px"
                                        alt={title}
                                    />
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
                
            </>
        )
    }else if(id == 'hobby'){
        return (
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.hobbyTitle}>{data.title}</h1>
                    <ul className={pageStyles.hobbyList}>
                        <li key="dance" className={pageStyles.hobbyDanceFrame}>
                            <iframe className={pageStyles.hobbyIframe} width="560" height="315" src="https://www.youtube.com/embed/fYXFJ9YxUQs?start=8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br />
                            <div>2007년부터 춤을 추었습니다.</div>
                        </li>
                        <li key="hobby" className={pageStyles.hobbyPianoFrame}>
                            <iframe className={pageStyles.hobbyIframe} width="560" height="315" src="https://www.youtube.com/embed/Srw3r_QA0RY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            <div>1997년부터 피아노를 배웠습니다.</div>
                        </li>
                        <li key="game" className={pageStyles.hobbyGameFrame}>
                            <iframe className={pageStyles.hobbyGameIframe} width="1000" height="550" src="https://yongwoonjang.github.io/SweetHome/"></iframe>
                            <div>또롱이의 집, 게임 개발도 하고 있습니다.</div>
                        </li>
                    </ul>
                </div>
            </>
        )
    }else if(id == 'communication'){
        return(
            <>
                <div>
                {content}
                </div>
            </>
        )
    }
    
}

export function getStaticPaths(){
    const postNames = ["profile", "politics","hobby","communication"]
  
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
