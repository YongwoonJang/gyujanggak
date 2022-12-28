import fs from 'fs'
import matter from 'gray-matter'
import parse from 'html-react-parser'
import pageStyles from '/styles/page.module.scss'
import profileDivTableStyles from '/styles/profileTable.module.scss'
import CopyRight from '/components/copyRight'
import Image from 'next/image'
import { useEffect, useRef } from 'react'


//const baseURL = "http://localhost:80";
const baseURL = "https://gyujanggak.vercel.app/api";

// These variables used for making stems
let stem = <div className={profileDivTableStyles.profileTreeBGItem}><div>&nbsp;</div><div className={profileDivTableStyles.profileTreeStem}>&nbsp;</div><div>&nbsp;</div></div>;
let stemOfKT = <div className={profileDivTableStyles.profileTreeBGItem}><div>&nbsp;</div><div className={profileDivTableStyles.jobTreeStem}>&nbsp;</div><div>&nbsp;</div></div>;


function sendToOwner(mailAddr, contents) {
    let mailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if(!mailAddr.match(mailRegExp)){
        
        let alarmText = document.createElement('div');
        alarmText.innerText = "메일 주소 양식이 맞지 않습니다.";
        alarmText.style = "color:white;margin-Bottom:1%";
        document.getElementById("returnEmail").parentElement.append(alarmText);
        return false;

    }else{
        //This block should implement send to realtime Database(questions)
        let alarmText = document.createElement('div');
        alarmText.innerText = "정상적으로 접수되었습니다.";
        alarmText.style = "color:white;margin-Bottom:1%";
        document.getElementById("returnEmail").parentElement.append(alarmText);

        //Initial snippets.
        let destination = baseURL + '/sendOwner';
        
        let url = new URL(destination);

        let params = { 'author': mailAddr, 'contents': contents };
        url.search = new URLSearchParams(params).toString();

        fetch(url);
        
        return true;

    }
}

function dynamicTextArea(element){
    setTimeout(()=>{
        element.style.cssText = 'height:auto;padding:0px;';
        element.style.cssText = 'height:' + element.scrollHeight + 'px';
        document.documentElement.scrollTop = document.documentElement.scrollTop + element.scrollHeight;
    
    },0)

}

function resetForm(event){
    let parentOfEmailInput = document.getElementById('returnEmail').parentElement;
    
    if(parentOfEmailInput.childElementCount >= 5){
        parentOfEmailInput.lastElementChild.remove();
    };

    if(event.code =="Enter"){
        event.preventDefault();
    }
}

//Static function
export function getStaticPaths() {
    const postNames = ["raterContract","profileManagement"]

    const params = postNames.map((postName) => ({
        params: { id: postName }
    }))

    return { paths: params, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
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

// The main caharacter card. 
// ------------------------
// |    ---
// |  / _  _ \   Identity : IT project manager 
// | | O  O  |   Be good at : Javascript, HTML, Shell, Projectmanagement 
// | |  __   |   
// |  \_____/  
function mainCharacterCard(){
    return(
        <>
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
                        <Image src={'/images/YongwoonJangMediaCenter.png'} width={360} height={500} layout="intrinsic" />
                    </div>
                </div>
                <div className={profileDivTableStyles.profileMainCharacterImgMobile}>
                    <div>
                        <Image src={'/images/YongwoonJangMediaCenter.png'} width={170} height={230} layout="fixed" />
                    </div>
                </div>
                <p>
                    Identity : IT project manager / IT service Initiator<br />
                    Be good at : JavaScript, HTML, Shell, Project management<br />
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
        </>
    )
}

// Common history card. 
//               History 
//                 |   born 
//    graduation   | 
//....commissioned |
//.....
function commonHistoryCard(){
    
    
    const leafSchool = useRef(null);
    const leafBorn = useRef(null);
    const leafOfficer = useRef(null);
    const leafEntry = useRef(null);

    useEffect(() => {
        window.addEventListener("scroll", function () {
            var leafElement = leafBorn.current;
            leafElement.style.marginTop = - document.documentElement.scrollTop / 20 + 'px';
            leafElement = leafSchool.current;
            leafElement.style.marginTop = - document.documentElement.scrollTop / 20 + 'px';
            leafElement = leafOfficer.current;
            leafElement.style.marginTop = - document.documentElement.scrollTop / 10 + 'px';
            leafElement = leafEntry.current;
            leafElement.style.marginTop = - document.documentElement.scrollTop / 25 + 'px';
        });
    }, []);

    return(
        <>
            <div>
                {stem}{stem}{stem}
                <div className={profileDivTableStyles.profileTreeBGItem}>
                    <div>
                        &nbsp;
                    </div>
                    <div className={profileDivTableStyles.profileTreeStem}>
                        &nbsp;
                    </div>
                    <div ref={leafBorn} className={profileDivTableStyles.profileTreeBornLeaf}>
                        -- 1989년 1월 인천 출생<br />
                        -- Born at Jan. 1989<br />
                    </div>
                </div>
                {stem}
                <div className={profileDivTableStyles.profileTreeBGItem}>
                    <div ref={leafSchool} className={profileDivTableStyles.profileTreeSchoolLeaf}>
                        <p>
                        2004년 3월, 인천고등학교 입학 --<br />
                        2007년 3월, 건국대학교 입학 --<br /><br />
                        March. 2004. Entrance to Inchon High school --<br/>
                        March. 2007. Entrance to Konkuk University --<br/>
                        </p>
                        <div>
                            <Image src={'/images/GraduationOfHighSchool.png'} width={300} height={235} />
                        </div>
                    </div>
                    <div className={profileDivTableStyles.profileTreeStem}>
                        &nbsp;
                    </div>
                    <div ref={leafSchool} className={profileDivTableStyles.profileTreeSchoolRightLeaf}>
                        <div>
                            <br /><br /><br />
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
                            -- 2011년 임관 (대한민국 통신장교) <br/>
                            -- March 2011. Commissione to Officer <br/>
                            <div>
                                <Image src={'/images/CommissionedAsAOfficer.png'} width={250} height={200} />
                            </div>
                        </p>
                    </div>
                </div>
                {stem}
                <div className={profileDivTableStyles.profileTreeBGItem}>
                    <div ref={leafEntry} className={profileDivTableStyles.profileTreeJobLeaf}>
                        <p>
                            2013년 7월 KT 입사 --<br />
                            July. 2013. Entrance to KT --<br/>
                        </p>
                    </div>
                    <div className={profileDivTableStyles.profileTreeStem}>
                        &nbsp;
                    </div>
                    <div>
                        &nbsp;
                    </div>
                </div>
            </div>
        </>
    )
    
}

// History of KT.
//               KT
//                | 
//                | -- 한글
//                | -- 2013년 11월 ~ 2014년 5월
//                | -- 통신사 Business Support System의 SW 라이선스 관리
//
function ktHistoryCard(){
    const leafBSS = useRef(null);
    const leafRater = useRef(null);
    // const leafOfficer = useRef(null);
    // const leafEntry = useRef(null);

    useEffect(() => {
        window.addEventListener("scroll", function () {
            if (document.documentElement.scrollTop > 900){
                leafBSS.current.style.marginTop =+ document.documentElement.scrollTop / 25 + 'px';
                leafRater.current.style.marginTop =- document.documentElement.scrollTop / 15 + 'px';
            }
        });
    }, []);

    return(
        <>
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
                    <div ref={leafBSS}>
                        <p>
                            <div className={profileDivTableStyles.detailedWorkExperienceStatement}>
                            -- 2013년 11월 ~ 2014년 5월 <br />
                            -- 통신사 Business support system의 SW 라이선스 관리 <br />
                            -- JIRA, Sharepoint Operating 운영 능력 향상 <br /><br />
                            -- Nov. 2013 ~ May. 2014 <br/>
                            -- Telco. BSS Resource and Software License management <br/>
                            -- Earned skill JIRA, Sharepoint Operating skill <br/>
                            </div>
                            <div>
                                <Image src={'/images/JiraSharepointLicense.png'} layout={"intrinsic"} width={150} height={180} />
                            </div>
                        </p>
                    </div>
                </div> 
                <div className={profileDivTableStyles.profileTreeBGItem}>
                    <div ref={leafRater} className={profileDivTableStyles.profileTreeWorkLeftLeaf}>
                        <div className={profileDivTableStyles.detailedWorkExperienceStatement}>
                            2014년 6월 ~ 2018년 11월 --<br />
                            통신사 유/무선 Rater system의 계약 관리 --<br />
                            이스라엘 업체와의 계약 및 협상 능력 향상 --<br/> <br/>
                            June 2014 ~ Nov 2018 --<br/>
                            통신사 BSS Rater(Billing) 서비스 운영 및 계약 관리 --<br/>
                            Earned skill : Contract with offshore (Israel) --<br/>
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
                    <div>
                        <p>
                            <div className={profileDivTableStyles.detailedWorkExperienceStatement}>
                                -- 2018년 11월 ~ 2022년 3월 31일 <br />
                                -- KT Cloud 포탈 BA 및 Cloud billing system BA <br />
                                -- REST API documentation, SaaS architecturing 능력 향상 <br /><br />
                                -- Nov. 2018 ~ March. 2022
                                -- KT Cloud portal BA / Cloud billing system BA <br />
                                -- Earned skill : REST API documentation, SaaS architecturing<br/>

                            </div>
                            <div>
                                <Image src={'/images/CloudPlatformJYU.jpg'} layout={"intrinsic"} width={280} height={350} />
                            </div>
                        </p>
                    </div>
                </div> 
            </div>
            <div className={profileDivTableStyles.ktBottom}>
                <Image src={'/images/background/GreenBand(bottom).png'} layout="responsive" width={1200} height={10} />
            </div>
        </>
    )


}

// History of kt cloud 
//               kt cloud
//                |
//          입사---| 
//----------------|
function ktcloudHistoryCard(){

    return(
        <>
            <div className={profileDivTableStyles.ktcloudProfileDivTableTitle}>
                kt cloud
            </div>
            <div className={profileDivTableStyles.ktcloudProfileTreeBGItem}>
                <div className={profileDivTableStyles.ktcloudProfileTreeWorkLeftLeaf}>
                    <div className={profileDivTableStyles.ktcloudDetailedWorkExperienceStatement}>
                        2022년 4월 1일 ~ 현재 -- <br />
                        SaaS 서비스 Product Owner(KT Cloud BizMeet, BizOffice, bizplay) --<br />
                        SaaS Marketing, Architecturing, CSAP 인증 능력 향상 --<br /><br />
                        Nov. 2018 ~ March. 2022 --<br/>
                        KT Cloud portal BA / Cloud billing system BA --<br />
                        Earned skill : REST API documentation, SaaS architecturing --<br/>
                    </div>
                    <div>
                        <Image src={'/images/ktToKtcloudNew.jpg'} layout={"intrinsic"} width={600} height={350} alt="Loading" />
                    </div>
                </div>
                <div className={profileDivTableStyles.jobTreeStem}>
                    &nbsp;
                </div>
                <div className={profileDivTableStyles.profileTreeBornLeaf}>
                </div>
            </div>
            {stemOfKT}
        </>
    )

}

function bottomLine(){
    useEffect(()=>{
        let contentsArea = document.getElementById("returnContents");
        let mailTextArea = document.getElementById("returnEmail")
        let sendButton = document.getElementById("sendButton");
        contentsArea.addEventListener("keydown",(event)=>{dynamicTextArea(contentsArea);resetForm(event)});
        mailTextArea.addEventListener("keydown",(event)=>{resetForm(event)});
        sendButton.addEventListener("click",  ()=>{sendToOwner(mailTextArea.value, contentsArea.value)});
        
    })
    return (
        <>
            <div className={profileDivTableStyles.bottomLine}>
                <div className={profileDivTableStyles.bottomLineLeft}>
                    <a href="https://gyujanggak.vercel.app/posts/profile">go to Home</a>
                </div>
                <div className={profileDivTableStyles.bottomLineRight}>
                        <div>문의사항과 응답받으실 메일주소를 남겨주세요.</div>
                        <textarea rows="1" id="returnContents" placeholder="문의사항 ex) 현재 어떤일을 주로 하고 계신가요?"/>
                        <textarea rows="1" id="returnEmail" placeholder='답변 받으실 메일 주소 ex) question@question.co.kr'/>
                        <button id="sendButton" className={profileDivTableStyles.bottomLineButton}>보내기</button>
                </div>
            </div>
        </>
    )
}

//Main function
export default function workExperience({id, data, contents}) {
    
    if (id == 'profileManagement') {//project management officer resume.
        return (
            <>
                <div className={profileDivTableStyles.profileDivTable}>
                    {mainCharacterCard()}
                    <div className={profileDivTableStyles.profileDivTableTitle}>
                        History
                    </div>
                    {commonHistoryCard()}
                    <div className={profileDivTableStyles.profileDivTableTitle}>
                        KT
                    </div>
                    <div>
                        {ktHistoryCard()} 
                    </div>
                    <div>
                        {ktcloudHistoryCard()}
                    </div>
                    <div>
                        {bottomLine()}
                    </div>
                </div>
                    
                <div>
                    <CopyRight />
                </div>
            </>
        )

    }else{
        let rows = "";
        rows = parse(rows);
        return (
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.workExperienceTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.workExperienceContents}>
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
