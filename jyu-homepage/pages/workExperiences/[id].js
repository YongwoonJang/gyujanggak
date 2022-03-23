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
            var leafElement = leafSchool.current;
            leafElement.style.marginTop = - document.documentElement.scrollTop/6 + 'px';
            leafElement = leafBorn.current; 
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
                        History
                    </div>
                    <div>
                        <div className={profileDivTableStyles.profileMainCharacter}>
                            <div className={profileDivTableStyles.profileMainCharacterBG}>
                                <Image src='/images/background/MainProfileBG.png' width={1000} height={450} />
                            </div>
                            <div>
                                <Image src={'/images/YongwoonJangMediaCenter.png'} width={370} height={500}/>
                            </div>
                            <p>
                            Identity : IT project manager / IT service Initiator<br/>
                            Be good at : JavaScript, HTML, Shell, Projectmanaging, Office<br/>
                            Language : Korean(Native), English(Intermediate)<br /><br />

                            Kor<br/>
                            저는 기록하는 것과 그것을 활용하는 것을 좋아합니다.<br/>
                            저와 사람들이 편리하게 생각을 펼치는 것을 돕는 것을 좋아합니다.<br/>
                            프로젝트 관리 능력과 기본적인 IT기술을 활용하여 좋은 서비스를 만들고싶습니다.<br/><br/>
                            
                            Eng<br/>
                            I like logging, system to make people comfortable.<br/>
                            I am used to take new technologies which make me comfort.

                            </p>
                            
                        </div>
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
                            <div ref={leafSchool} className={profileDivTableStyles.profileTreeEntLeaf}>
                                2007년 인천고등학교 입학 / 건국대학교 입학 -------<br/>
                                <div>
                                    <Image src={'/images/GraduationOfHighSchool.jpeg'} width={200} height={200}/>
                                </div>
                            </div>
                            <div className={profileDivTableStyles.profileTreeStem}>
                                &nbsp;
                            </div>
                            <div className={profileDivTableStyles.profileTreeBornLeaf}>
                        
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
                                ----------  2011년 임관(대한민국 통신장교)
                                <div>
                                    <Image src={'/images/CommissionedAsAOfficer.jpeg'} width={200} height={200} />
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
                                    ----------  2013년 7월 KT 입사
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
                                    -- Nov.2013 ~ May.2014 BSS Resource and Software License management (using JIRA, Sharepoint) <br/>
                                    &nbsp; &nbsp; + Earned kill : Complete PMP courese, JIRA, Sharepoint OP skill
                                    </div>
                                    <div>
                                        <Image src={'/images/JiraSharepointLicense.jpg'} layout={"intrinsic"} width={200} height={200} />
                                    </div>
                                </p>
                            </div>
                        </div> 
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div ref={leafSchool} className={profileDivTableStyles.profileTreeWorkLeftLeaf}>
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
