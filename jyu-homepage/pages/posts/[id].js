import fs from 'fs'
import React from 'react'
import matter from 'gray-matter'
import parse from 'html-react-parser'

// Next.js
import Link from 'next/link'
import Image from 'next/image'

// CSS
import pageStyles from '/styles/page.module.scss'

// Components
import CopyRight from '../../components/copyRight'
import WorkHistory from '../../components/workHistory'
import CommentTable from '../../components/commentTable'
import WebGL from '../../components/webGL'

// Utilities
import bubbleSortForBookTitleByAlpahbet from '../../components/utils'


//Static function
export function getStaticPaths() {
    const postNames = ["profile", "community", "hobby", "communication"]
    const params = postNames.map((postName) => ({
        params: { id: postName }

    }))
    return {
        paths: params,
        fallback: 'blocking'
    }

}

export async function getStaticProps({ params }) {
    const fullPath = "public/posts/" + params.id + ".md"
    const fileContent = fs.readFileSync(fullPath)
    const matterResult = matter(fileContent)

    return {
        props: {
            id: params.id,
            data: matterResult.data,
            contents: matterResult.content,
        },
    }
}

//Main function
export default function Post({id, data, contents}){
    //Variables for contents area
    const content = parse(contents);
    
    if(id == 'profile'){
        return (
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.profileTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.profileImage}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className={pageStyles.profileMotto}>
                                        {parse(data.headLine)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <img layout="intrinsic"  width="400px" height="300px" src={"/images/profileImage.jpeg"} alt="My profile" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={pageStyles.profileWorkBox}>
                        <div>
                            {content}
                        </div>
                        <div>
                            <WorkHistory data={data}/>
                        </div>
                    </div>
                </div>
                <div>
                    <CopyRight />
                </div>
            </>
        )

    } else if(id == 'community'){
        return (
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.communityTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.communityMotto}>
                        {content}
                    </div>
                </div>
                <div className={pageStyles.politicsTitleBox}>
                    <ul className={pageStyles.politicsTitleList}>
                        {data.politicsList.map(({ id, title, url, description }) => (
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
                <div>
                    <CopyRight />
                </div>
            </>
        )

    }else if(id == 'hobby'){
        let contents = "";

        for(let i = 0; i < Object.keys(data.hobbyList).length; i++){
            
            let category = Object.keys(data.hobbyList)[i];
            contents = contents + "<li id='"+category+"'><span>" + category + "</span><br/>";
            contents = contents + "Skill : " + data.hobbyList[category]["Skill"] + "<br/>";
            for(let j = 1; j<Object.keys(data.hobbyList[category]).length; j++){
                contents = contents 
                            + "Experience" 
                            + j.toString()
                            + " : " 
                            + "<a href='" + data.hobbyList[category][j]["URL"] + "'>" 
                            + data.hobbyList[category][j]["Title"] 
                            + "</a><br/>";
            }
            contents = contents + "</li><br/>";
                        
        }

        contents = parse(contents);
        

        return (
            <>
                <div>
                    <div className={pageStyles.hobbyPhoto}>
                        <WebGL />
                    </div>
                    <h1 className={pageStyles.hobbyTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.hobbyMotto}>
                        {content}
                    </div>
                    <div className={pageStyles.hobbyList}>
                        <ul>
                            {contents}
                        </ul>
                    </div>
                    <div className={pageStyles.hobbyCharacter}>
                        <Image src="/images/20220430stupido.png" width={400} height={300}/>
                    </div>
                    <div>
                        <CopyRight />
                    </div>
                </div>
                
            </>
        )

    } else if (id == 'communication') {
        //sort books title.
        console.log(bubbleSortForBookTitleByAlpahbet(data.books));

        return (
            <>
                <div className={pageStyles.page}>
                    <div className={pageStyles.communicationMainBackgroundImage}>
                        <h1 className={pageStyles.communicationTitle}>
                            <p>
                            {parse(data.title)}
                            </p>
                        </h1>
                        <div className={pageStyles.communicationList}>
                            {parse(contents.replace(/\n\n/g,"\n").split('\n').slice(0,-1).join('<p>'))}
                        </div>
                    </div>
                    <div>
                        <div id="books" className={pageStyles.communicationSubTitle}>
                            Books
                        </div>
                        <div className={pageStyles.bookTitleBox}>
                            <ul className={pageStyles.bookTitleList}>
                                {bubbleSortForBookTitleByAlpahbet(data.books).map(({ id, title, date, author }) => (
                                    <>
                                        <li key={id}>
                                            <Link href={"/books/"+id}>
                                                <a>{title}&nbsp;&nbsp;({date},&nbsp;{author})</a>
                                            </Link>
                                        </li>
                                    </>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <CommentTable/>
                    </div>
                </div>
                <div>
                    <CopyRight />
                </div>
            </>
        )
    }
}
