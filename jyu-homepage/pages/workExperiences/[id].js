import fs from 'fs'
import matter from 'gray-matter'
import parse from 'html-react-parser'
import pageStyles from '/styles/page.module.scss'
import profileDivTableStyles from '/styles/profileTable.module.scss'
import CopyRight from '/components/copyRight'
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
        for (let i = 1; i < countOfRows+1; i++) {
            rows = rows
                + "<tr>"
                + data.rows[i].split("|").map(x => "<td>" + x + "</td>").toString().replace(/,/g, "")
                + "</tr>";
        }
        rows = parse(rows);

        return (
            <>
                <div className={profileDivTableStyles.profileDivTable} role="region" aria-labelledby="Caption01" tabindex="0">
                    <div className={profileDivTableStyles.profileDivTableTitle}>
                        History
                    </div>
                    <div>
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
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div>&nbsp;</div>
                            <div className={profileDivTableStyles.profileTreeStem}>
                            &nbsp;
                            </div>
                            <div>&nbsp;</div>
                        </div>
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div ref={leafSchool} className={profileDivTableStyles.profileTreeEntLeaf}>
                                2007년 건국대학교 입학 -------
                            </div>
                            <div className={profileDivTableStyles.profileTreeStem}>
                                &nbsp;
                            </div>
                            <div className={profileDivTableStyles.profileTreeBornLeaf}>
                        
                            </div>
                        </div>
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div>&nbsp;</div>
                            <div className={profileDivTableStyles.profileTreeStem}>
                                &nbsp;
                            </div>
                            <div>&nbsp;</div>
                        </div>
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
                                </p>
                            </div>
                        </div>
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div>&nbsp;</div>
                            <div className={profileDivTableStyles.profileTreeStem}>
                                &nbsp;
                            </div>
                            <div>&nbsp;</div>
                        </div>
                        <div className={profileDivTableStyles.profileTreeBGItem}>
                            <div>&nbsp;</div>
                            <div className={profileDivTableStyles.profileTreeStem}>
                                &nbsp;
                            </div>
                            <div>&nbsp;</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            {parse(data.header.split("|").map(x => "<th>" + x + "</th>").toString().replace(/,/g, " "))}
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
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
