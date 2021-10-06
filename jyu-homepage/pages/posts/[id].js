import fs from 'fs'

import matter from 'gray-matter'
import parse from 'html-react-parser'

import Image from 'next/image'
import Link from 'next/link'
import pageStyles from '/styles/page.module.scss'

import RequestFormAndResult from '../../components/searchFormForBoard'
import CopyRight from '../../components/copyRight'


export function getStaticPaths() {
    const postNames = ["profile", "profile-mgmt", "politics", "hobby", "communication"]

    const params = postNames.map((postName) => ({
        params: { id: postName }
    }))

    return { paths: params, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
    const fullPath = "public/posts/" + params.id + ".md"
    const fileContent = fs.readFileSync(fullPath)

    const matterResult = matter(fileContent)
    return {
        props: {
            id: params.id,
            data: matterResult.data,
            contents: matterResult.content
        },
    }
}

export default function Post({id, data, contents}){
    const content = parse(contents)
    const politicsList = [
        { "id": "inspectOfStateAdministration", "title": "국정감사정보", "description": "국회운영윈원회, 방송통신위원회 및 위회원 정보 수록", "url": "https://likms.assembly.go.kr/inspections/main.do" },
        { "id": "nationalAssemblyLawInformation", "title": "국회법률정보", "description":"국회에 제한된 법률 정보 수록", "url": "http://likms.assembly.go.kr/law/lawsNormInqyMain1010.do?mappingId=%2FlawsNormInqyMain1010.do&genActiontypeCd=2ACT1010" },
        { "id": "nationalAssemblyMinutes", "title": "국회 회의록", "description": "전체 회의 내용 등재(속기사의 힘)", "url": "http://likms.assembly.go.kr/record/index.jsp" },
        { "id": "personalizedLegislative", "title": "입법 컨텐츠 검색 포탈", "description": "입법 내역 검색 포탈", "url": "http://naph.assembly.go.kr/index.jsp" },
        { "id": "openCongress", "title": "열려라 국회", "description": "각 개별 의원의 후원금, 제안 법안 의결 현황 수록.", "url": "http://watch.peoplepower21.org/home" },
        { "id": "budgetSettlementInfo", "description": "회계년도별 예산안/기금운용계획안/추가경정예산안 수록", "title": "예결산정보시스템", "url": "http://likms.assembly.go.kr/bill/nafs/nafsList.do" },
        { "id": "billInfo", "title": "의안정보", "description":"검토보고서, 심사보고서 수록", "url": "http://likms.assembly.go.kr/bill/main.do" }
    ]
    
    if(id == 'profile'){
        let workHistory = "<table><tbody>";
        const countOfRows = 5;
        for(let i = countOfRows; i > 0; i--){
            workHistory = workHistory 
                        + "<tr><td>"
                        + (countOfRows+1-i).toString()+". "+"<a href='" + data.workExperience[i]["URL"] + "'>"
                        + data.workExperience[i]["Summary"]
                        + "</a>("
                        + data.workExperience[i]["Period"]
                        + ")</td></tr>"
                        + "<tr style='font-size: 0.9em; color: rgb(149, 143, 143)'><td>"
                        + "&nbsp&nbsp" + data.workExperience[i]["Description"]
                        + "</td></tr>"
        }
        workHistory = parse(workHistory+"</tbody></table>");

        return (
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.profileTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.profileImage}>
                        <table>
                            <tr>
                                <td className={pageStyles.profileMotto}>
                                    &nbsp;&nbsp;사소한 생활의 문제를 해결하고 싶은 <br/>
                                    &nbsp;&nbsp;기획자, Artist, programmer입니다.
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <img layout="intrinsic"  width="400px" height="300px" src={"/images/profileImage.jpeg"} alt="My profile" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={pageStyles.profileWorkBox}>
                        <div>
                            {content}
                        </div>
                        <div>
                            {workHistory}
                        </div>
                    </div>
                </div>
                <CopyRight />
            </>
        )
    }else if(id == 'profile-mgmt'){
        let rows = "";
        const countOfRows = 14;
        for(let i = 14; i > 0; i--){
            rows = rows + "<tr>" + data.rows[i].split("|").map(x => "<td>"+x+"</td>").toString().replace(/,/g,"") + "</tr>";
        }
        rows = parse(rows);

        return (
            <>
                
                <div className={pageStyles.profileDivTable} role="region" aria-labelledby="Caption01" tabindex="0">
                    <div className={pageStyles.profileDivTableTitle}>
                        History
                    </div>
                    <table>
                        <thead>
                            {parse(data.header.split("|").map(x => "<th>"+x+"</th>").toString().replace(/,/g," "))}
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
                <CopyRight />
            </>
        )
    }else if(id == 'politics'){
        return (
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.politicsTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.politicsMotto}>
                        {content}
                    </div>
                </div>
                <div className={pageStyles.politicsTitleBox}>
                    <ul className={pageStyles.politicsTitleList}>
                        {politicsList.map(({ id, title, url, description }) => (
                            <>
                                <li key={id}>
                                    <Link href={url}>
                                        <a>{title}</a>
                                    </Link>
                                    &nbsp;:&nbsp;
                                    <span>
                                        {description}
                                    </span>
                                </li>
                            </>
                        ))}
                    </ul>
                </div>
                <CopyRight />
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
                <CopyRight />
            </>
        )
    }else if(id == 'communication'){
        return(
            <>
                <RequestFormAndResult/>
            </>
        )
    }
    
}