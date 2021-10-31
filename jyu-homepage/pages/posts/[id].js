import fs from 'fs'
import React, { useState, useRef, useEffect} from 'react'
import matter from 'gray-matter'
import parse from 'html-react-parser'

// Next.js
import Link from 'next/link'

// CSS
import pageStyles from '/styles/page.module.scss'

// Components
import CopyRight from '../../components/copyRight'
import WorkHistory from '../../components/workHistory'

// WebGL
import { vsSource, fsSource, createShader, createProgram, initBuffer, render } from '/components/drawingTheScene'
import { drawScene } from '../../components/drawingTheScene'

// Database Utilities
import { readDatabase, insertRow, deleteRow } from '../../components/databaseUtils'

//Static function
export function getStaticPaths() {
    const postNames = ["profile", "politics", "hobby", "communication"]
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
    let comments = await readDatabase('gyujanggak')

    return {
        props: {
            id: params.id,
            data: matterResult.data,
            contents: matterResult.content,
            comments: comments
        },
    }
}

//Main function
export default function Post({id, data, contents, globalComments}){
    //Variables for contents area
    const content = parse(contents);
    
    //Variables for comments area
    const [lines, setLines] = useState("");

    //Variables for dialogue area
    const [defaultContents, setContents] = useState("Hello world");
    const [defaultAuthor, setAuthor] = useState("JYU");
    const [comments, setComments] = useState(globalComments);

    const commentTableRef = useRef(null);
    const delDocIdRef = useRef(null);
    
    //References for editor area
    const editCommentBox = useRef(null);
    const editorBox = useRef(null);
    const regButton = useRef(null);
    const delButton = useRef(null);
    
    const setTable = (localComments) => {
        if(localComments != null){
            let rows = "";
            for (let i = (localComments.length - 1); i >= 0; i--) {
                rows = rows
                    + "<tr>"
                    + "<td>"
                    + "<span>"
                    + localComments[i].Author
                    + "</span>"
                    + "<br/>"
                    + localComments[i].Date
                    + "</td>"
                    + "<td>"
                    + localComments[i].Content
                    + "</td>"
                    + "<td style='display:none'>"
                    + localComments[i].docId
                    + "</td>"
                    + "</tr>"
            }

            setLines(rows);
        }
    }

    const settingButton = (e) => {
        if (delDocIdRef.current.innerHTML == e.currentTarget.children[2].innerHTML) {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "black";
            regButton.current.style.display = "block";
            delButton.current.style.display = "none";
            delDocIdRef.current.innerHTML = "";

        } else if (delDocIdRef.current.innerHTML != e.currentTarget.children[2].innerHTML) {
            commentTableRef.current.querySelectorAll('tr').forEach(tr => { tr.style.backgroundColor = "white"; tr.style.color = "black" })
            e.currentTarget.style.backgroundColor = "rgb(166, 26, 26)";
            e.currentTarget.style.color = "white";
            regButton.current.style.display = "none";
            delButton.current.style.display = "block";
            delDocIdRef.current.innerHTML = e.currentTarget.children[2].innerHTML;

        }

        if (delDocIdRef.current.innerHTML != "") {
            editCommentBox.current.children[0].value = e.currentTarget.children[1].innerHTML;
            editorBox.current.children[0].value = e.currentTarget.children[0].children[0].innerHTML;

        } else {
            editCommentBox.current.children[0].value = "";
            editorBox.current.children[0].value = "";

        }
    };

    useEffect(async () => {
        setComments(await readDatabase('gyujanggak'));

    },[]);

    useEffect(() => {
        setTable(comments);
        
    },[comments]);

    //Component did mount
    useEffect(() => {
        if(commentTableRef.current != null){
            commentTableRef.current.querySelectorAll('tr').forEach(e => e.addEventListener("click", settingButton));

        }
            return function cleanup() {
                if (commentTableRef.current != null) {    
                    commentTableRef.current.querySelectorAll('tr').forEach(e => e.removeEventListener("click", settingButton));

                }
            };
    }, [lines]);

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

    } else if(id == 'politics'){
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
        
        //WebGL Part
        useEffect(() => {
            // Init variables
            const canvas = document.querySelector('#glCanvas');

            // Create Shader program
            const gl = canvas.getContext("webgl");
            if (gl == null) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            }
            var vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
            var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
            var program = createProgram(gl, vertexShader, fragmentShader);

            //Setting the program 
            const programInfo = {
                program: program,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
                    textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
                    modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
                    
                },
            };

            // Setting the buffer
            const buffer = initBuffer(gl);

            // draw scene
            drawScene(gl, programInfo, buffer);
            requestAnimationFrame(render);

        })

        for(let i = 0; i < Object.keys(data.hobbyList).length; i++){
            
            let category = Object.keys(data.hobbyList)[i];
            contents = contents + "<li key='"+category+"'><span>" + category + "</span><br/>";
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
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.hobbyTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.hobbyPhoto}>
                        <canvas id="glCanvas" width="200" height="200"></canvas>
                    </div>
                    <div className={pageStyles.hobbyMotto}>
                        {content}
                    </div>
                </div>
                <div className={pageStyles.hobbyList}>
                    <ul>
                        {contents}
                    </ul>
                </div>
                <div>
                    <CopyRight />
                </div>
            </>
        )

    } else if (id == 'communication') {
        const handleContentsChange = event => {
            event.preventDefault();
            setContents(event.target.value);

        }

        const handleAuthorChange = event => {
            event.preventDefault();
            setAuthor(event.target.value);

        }

        const insertOrDelComment = event => {
            event.preventDefault();

            if (delDocIdRef.current.innerHTML != "") {
                deleteRow(delDocIdRef.current.innerHTML, setComments);
                alert("성공적으로 삭제되었습니다.");

            } else {
                insertRow(defaultAuthor, defaultContents, setComments);
                alert("성공적으로 저장되었습니다.");

            }

            //reset all of status about delete and write.
            commentTableRef.current.querySelectorAll('tr').forEach(tr => {
                tr.style.backgroundColor = "white";
                tr.style.color = "black";
                regButton.current.style.display = "block";
                delButton.current.style.display = "none";
            })

            delDocIdRef.current.innerHTML = "";
            editCommentBox.current.children[0].value = "";
            editorBox.current.children[0].value = "";


        }

        return (
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.communicationTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.communicationList}>
                        {parse(contents.replace(/\n/g, "<br/>"))}
                    </div>
                    <div>
                        <div className={pageStyles.communicationComments}>
                            Books
                        </div>
                        <div className={pageStyles.bookTitleBox}>
                            <ul className={pageStyles.bookTitleList}>
                                {data.books.map(({ id, title, url, date, author }) => (
                                    <>
                                        <li key={id}>
                                            <Link href={url}>
                                                <a>{title}&nbsp;&nbsp;({date},&nbsp;{author})</a>
                                            </Link>
                                        </li>
                                    </>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div className={pageStyles.communicationComments}>
                            Comments
                        </div>
                        <table ref={commentTableRef} className={pageStyles.communicationCommentsTable}>
                            <tbody>
                                {parse(lines)}
                            </tbody>
                        </table>
                    </div>
                    <div className={pageStyles.communicationRegForm}>
                        <form onSubmit={insertOrDelComment}>
                            <div className={pageStyles.communicationRegComment}>
                                <div ref={editCommentBox} className={pageStyles.communicationRegCommentBox}>
                                    <textarea id="comment" placeholder={defaultContents} onChange={handleContentsChange} />
                                </div>
                                <div ref={editorBox} className={pageStyles.communicationAuthorBox}>
                                    <input id="author" placeholder={defaultAuthor} onChange={handleAuthorChange} />
                                </div>
                                <div ref={regButton} className={pageStyles.communicationRegButtonBox}>
                                    <button type="submit">게시  하기</button>
                                </div>
                                <div ref={delButton} className={pageStyles.communicationDelButtonBox}>
                                    <button type="submit">삭제  하기</button>
                                </div>
                            </div>
                            <div ref={delDocIdRef} style={{ display: "none" }}></div>
                        </form>
                    </div>
                </div>
                <div>
                    <CopyRight />
                </div>
            </>
        )
    }
}
