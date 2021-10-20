import fs from 'fs'
import matter from 'gray-matter'
import parse from 'html-react-parser'
import pageStyles from '/styles/page.module.scss'

//Static function
export function getStaticPaths() {
    const postNames = ["20160101Rater"]

    const params = postNames.map((postName) => ({
        params: { id: postName }
    }))

    return { paths: params, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
    //It only process one time

    const fullPath = "public/workExperiences/" + params.id + ".md"
    let matterResult = {"data" : {"title":"Ready"},"content" : "내용 준비 중입니다. 현재 영업 전산 프로젝트 계약 관리만 내용이 있습니다."};

    try{
        const fileContent = fs.readFileSync(fullPath)
        matterResult = matter(fileContent)
    
    }catch( error ){
        console.log(error);
        console.log("내용 준비 중입니다.");

    }
    
    return {
        props: {
            data: matterResult.data,
            contents: matterResult.content
        },
    }
}


//Main function
export default function workExperience({data, contents}) {
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
        </>
    )
}
