import fs from 'fs'
import matter from 'gray-matter'
import parse from 'html-react-parser'
import pageStyles from '/styles/page.module.scss'
import CopyRight from '../../components/copyRight'
import HistoryTable from '../../components/historyTable'

//Static function
export function getStaticPaths() {
    const postNames = ["WhenAttitudesBecomeArtwork", "RembrandtLeClairL'obscur", "BookStoreInPharmacy", "HabitOfProjectManager", "Speed"]

    const params = postNames.map((postName) => ({
        params: { id: postName }
    }))

    return { paths: params, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
    
    
    //It only process one time
    const fullPath = "public/books/" + params.id + ".md"
    let matterResult = { "data": { "title": "Ready" }, "content": "내용 준비 중입니다." };

    try {
        const fileContent = fs.readFileSync(fullPath)
        matterResult = matter(fileContent)

    } catch (error) {
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
export default function books({ data, contents }) {
    
    let imagePart = "";
    if(data.images != null){
        // imagePart = <div className={pageStyles.bookImage}>
        //     <img src={data.images[0]} width={data.imageWidth[0]+'%'} layout="responsive" />
        // </div>;
        imagePart = <img src={data.images[0]} className={pageStyles.bookImage} width={data.imageWidth[0]+'%'} height={100+"%"} layout="responsive" />;

    }

    return (
        <>
            <div className={pageStyles.page}>
                <h1 className={pageStyles.communicationTitle}>
                    {parse(data.title)}
                </h1>
                <div className={pageStyles.opinionBox}>
                    {imagePart}
                    <div className={pageStyles.opinion}>
                        {parse(contents.replace(/\n/g, "<br/>"))}                
                    </div>
                </div>
                <div className={pageStyles.loanButton}>
                    <a href={data.loanButton}>대출 하기</a>
                </div>
                <HistoryTable name={data.title}/>
            </div>
            <div>
                <CopyRight />
            </div>
        </>
    )
}
