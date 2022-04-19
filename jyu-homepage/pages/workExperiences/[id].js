import fs from 'fs'
import matter from 'gray-matter'
import parse from 'html-react-parser'
import pageStyles from '/styles/page.module.scss'
import profileDivTableStyles from '/styles/profileTable.module.scss'
import CopyRight from '/components/copyRight'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

//Static function
export function getStaticPaths() {
    const postNames = ["20160101Rater","profile-mgmt"]

    const params = postNames.map((postName) => ({
        params: { id: postName }
    }))

    return { paths: params, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
    //It only process one time

    const fullPath = "public/workExperiences/" + params.id + ".md"
    let matterResult = {"data" : {"title":"Ready"},"content" : "현재 영업 전산 프로젝트 계약 관리만 내용이 있습니다."};

    try{
        const fileContent = fs.readFileSync(fullPath)
        matterResult = matter(fileContent)
    
    }catch( error ){
        console.log(error);

    }
    
    return {
        props: {
            id: params.id,
            data: matterResult.data,
            contents: matterResult.content

        },
    }
}


//Main function
export default function workExperience({id, data, contents}) {
    
    const leafSchool = useRef(null);
    const leafBorn = useRef(null);
    const leafOfficer = useRef(null);

    useEffect(() =>{
        // Event Listener 
        window.addEventListener("scroll", function(){
            var leafElement = leafBorn.current;
            leafElement.style.marginTop = - document.documentElement.scrollTop/20 + 'px';
            leafElement = leafSchool.current; 
            leafElement.style.marginTop = - document.documentElement.scrollTop / 10 + 'px';
            leafElement = leafOfficer.current;
            leafElement.style.marginTop = - document.documentElement.scrollTop / 10 + 'px';

        });
    },[]);

    if (id == 'profile-mgmt') {//project management officer resume.
        let rows = "";
        const countOfRows = 14;
        for (let i = 10; i < countOfRows+1; i++) {
            rows = rows
                + "<tr>"
                + data.rows[i].split("|").map(x => "<td>" + x + "</td>").toString().replace(/,/g, "")
                + "</tr>";
        }
        rows = parse(rows);

        let stem = <div className={profileDivTableStyles.profileTreeBGItem}><div>&nbsp;</div><div className={profileDivTableStyles.profileTreeStem}>&nbsp;</div><div>&nbsp;</div></div>;
        let stemOfKT = <div className={profileDivTableStyles.profileTreeBGItem}><div>&nbsp;</div><div className={profileDivTableStyles.jobTreeStem}>&nbsp;</div><div>&nbsp;</div></div>;

        return (
            <>
                <div className={profileDivTableStyles.profileDivTable} role="region" aria-labelledby="Caption01" tabindex="0">
                    <div className={profileDivTableStyles.profileDivTableTitle}>
                        Yongwoon Jang
                    </div>
                    <div className={profileDivTableStyles.profileMainCharacter}>
                        <div className={profileDivTableStyles.profileMainCharacterBG}>
                            <div>
                                <Image src='/images/background/MainProfileBG.png' width={1200} height={500} />
                            </div>
                        </div>
                        <div className={profileDivTableStyles.profileMainCharacterImgDesktop}>
                            <div>
                                <Image src={'/images/YongwoonJangMediaCenter.png'} width={360} height={500} layout="intrinsic"/>
                            </div>
                        </div>
                        <div className={profileDivTableStyles.profileMainCharacterImgMobile}>
                            <div>
                                <Image src={'/images/YongwoonJangMediaCenter.png'} width={170} height={230} layout="fixed" />
                            </div>
                        </div>

                        <p>
                            Identity : IT project manager / IT service Initiator<br />
                            Be good at : JavaScript, HTML, Shell, Projectmanaging, Office<br />
                            Language : Korean(Native), English(Intermediate)<br /><br />

                            Kor<br />
                            저는 기록하는 것과 그것을 활용하는 것을 좋아합니다.<br />
                            저와 사람들이 편리하게 생각을 펼치는 것을 돕는 것을 좋아합니다.<br />
                            프로젝트 관리 능력과 기본적인 IT기술을 활용하여 좋은 서비스를 만들고싶습니다.<br /><br />

                            Eng<br />
                            I like logging, system to make people comfortable.<br />
                            I am used to take new technologies which make me comfort.<br /><br />

                            You can reach me via <br />
                            Github : <a href="https://github.com/YongwoonJang">Yongwoon Jang</a><br />
                            Naver Blog : <a href="https://blog.naver.com/jyy3k">Artist, Programmer:블로그</a><br />
                            Media : <a href="https://www.youtube.com/channel/UCCBDNHHeeh5FZX3ZnJ1VDcg">Yongwoon Jang:유튜브</a><br />
                            Email : <a href="mailto:royalfamily89@gmail.com">Yongwoon Jang</a>


                        </p>

                    </div>
                    <div className={profileDivTableStyles.profileDivTableTitle}>
                        History
                    </div>
                    <div>
                        {stem}
                        {stem}
                        {stem}
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div>
                                &nbsp;
                            </div>
                            <div className={profileDivTableStyles.profileTreeStem}>
                                &nbsp;
                            </div>
                            <div ref={leafBorn} className={profileDivTableStyles.profileTreeBornLeaf}>
                                ------  1989년 인천 출생
                            </div>
                        </div>
                        {stem}
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div ref={leafSchool} className={profileDivTableStyles.profileTreeSchoolLeaf}>
                                2007년 인천고등학교 입학 <br/> 건국대학교 입학 -------<br/>
                                <div>
                                    <Image src={'/images/GraduationOfHighSchool.png'} width={300} height={235}/>
                                </div>
                            </div>
                            <div className={profileDivTableStyles.profileTreeStem}>
                                &nbsp;
                            </div>
                            <div className={profileDivTableStyles.profileTreeBornLeaf}>
                                <div>
                                    <br/><br/><br/>
                                    <Image src={'/images/AtTheUniv.png'} width={250} height={200} />
                                </div>
                            </div>
                        </div>
                        {stem}
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div>
                                &nbsp;
                            </div>
                            <div className={profileDivTableStyles.profileTreeStem}>
                                &nbsp;
                            </div>
                            <div ref={leafOfficer} className={profileDivTableStyles.profileTreeOfficerLeaf}>
                                <p>
                                ---------- <br/> 2011년 임관<br/>(대한민국 통신장교)
                                <div>
                                    <Image src={'/images/CommissionedAsAOfficer.png'} width={250} height={200} />
                                </div>
                                </p>
                            </div>
                        </div>
                        {stem}
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div>
                                &nbsp;
                            </div>
                            <div className={profileDivTableStyles.profileTreeStem}>
                                &nbsp;
                            </div>
                            <div ref={leafOfficer} className={profileDivTableStyles.profileTreeJobLeaf}>
                                <p>
                                    ----------  <br/> 2013년 7월 KT 입사
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={profileDivTableStyles.profileDivTableTitle}>
                        KT
                    </div>
                    <div>
                        <Image src={'/images/background/GreenBand.png'} layout="responsive" width={1200} height={10} />
                    </div>
                    <div className={profileDivTableStyles.detailedWorkExperienceBG}>
                        {stemOfKT}
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div>
                                &nbsp;
                            </div>
                            <div className={profileDivTableStyles.jobTreeStem}>
                                &nbsp;
                            </div>
                            <div ref={leafOfficer}>
                                <p>
                                    <div className={profileDivTableStyles.detailedWorkExperienceStatement}>
                                    -- 우리말 <br />
                                    -- 2013년 11월 ~ 2014년 5월 <br />
                                    -- Business support system의 SW 라이선스 관리 <br />
                                    -- JIRA, Sharepoint Operating 운영 능력 향상 <br /><br />
                                    -- English  <br />
                                    -- Nov.2013 ~ May.2014 <br/>
                                    -- BSS Resource and Software License management <br/>
                                    -- Earned skill JIRA, Sharepoint Operating skill <br/>
                                    </div>
                                    <div>
                                        <Image src={'/images/JiraSharepointLicense.png'} layout={"intrinsic"} width={150} height={180} />
                                    </div>
                                </p>
                            </div>
                        </div> 
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div className={profileDivTableStyles.profileTreeWorkLeftLeaf}>
                                <div className={profileDivTableStyles.detailedWorkExperienceStatement}>
                                    June. 2014 ~ Nov. 2018 BSS Rater(Billing) service OP/Procurement management -------<br/>
                                    &nbsp; &nbsp; + Earned kill : Contract with other nations(Israel)
                                </div>
                                <div>
                                    <Image src={'/images/procurementManagement.jpeg'} width={400} height={300} />
                                </div>
                            </div>
                            <div className={profileDivTableStyles.jobTreeStem}>
                                &nbsp;
                            </div>
                            <div className={profileDivTableStyles.profileTreeBornLeaf}>
                            </div>
                        </div>
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div>
                                &nbsp;
                            </div>
                            <div className={profileDivTableStyles.jobTreeStem}>
                                &nbsp;
                            </div>
                            <div ref={leafOfficer}>
                                <p>
                                    <div className={profileDivTableStyles.detailedWorkExperienceStatement}>
                                        --  Nov.2018 ~ Current Cloud  portal BA, Billing manager <br/>
                                        &nbsp; &nbsp; + Earned kill : REST API documentation, SaaS architecturing
                                    </div>
                                    <div>
                                        <Image src={'/images/CloudPlatformJYU.jpg'} layout={"intrinsic"} width={270} height={350} />
                                    </div>
                                </p>
                            </div>
                        </div> 
                    </div>
                    <div>
                        <Image src={'/images/background/GreenBand(bottom).png'} layout="responsive" width={1200} height={10} />
                    </div>
                </div>
                <div>
                    <CopyRight />
                </div>
            </>
        )

    }else{//2021 rater project summary 
        return (
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.communicationTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.communicationList}>
                        {parse(contents.replace(/\n/g, "<br/>"))}
                    </div>
                </div>
                <div>
                    <CopyRight />
                </div>
            </>
        )

    }
}
