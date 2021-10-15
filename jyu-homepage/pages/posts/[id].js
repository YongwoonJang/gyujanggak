import fs from 'fs'

import { useState, useRef } from 'react'

import matter from 'gray-matter'
import parse from 'html-react-parser'

import Link from 'next/link'
import pageStyles from '/styles/page.module.scss'
import profileDivTableStyles from '/styles/profileTable.module.scss'

import CopyRight from '../../components/copyRight'

import React, { useEffect } from 'react'
import { vsSource, fsSource, createShader, createProgram, initBuffer, render } from '/components/drawingTheScene'
import { drawScene } from '../../components/drawingTheScene'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from '../../components/firebase';

import { setDoc, deleteDoc, collection } from "firebase/firestore";
import { doc, getDocs } from "firebase/firestore";

async function readDatabase() {
    initializeApp(firebaseConfig);
    const db = getFirestore();
    let data = [];

    const querySnapshot = await getDocs(collection(db, "gyujanggak"));
    querySnapshot.forEach((doc) => {
        let tempObject = doc.data();
        tempObject["docId"] = doc.id;
        data.push(tempObject);

    });

    return data;
}

//Static function
export function getStaticPaths() {
    const postNames = ["profile", "profile-mgmt", "politics", "hobby", "communication"]

    const params = postNames.map((postName) => ({
        params: { id: postName }
    }))

    return { paths: params, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
    //It only process one time

    const fullPath = "public/posts/" + params.id + ".md"
    const fileContent = fs.readFileSync(fullPath)
    const matterResult = matter(fileContent)
    let comments = await readDatabase()
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
    const content = parse(contents);
    
    //this line is used for comments
    const [lines, setLines] = useState("");
    const [defaultContents, setContents] = useState("Hello world");
    const [defaultAuthor, setAuthor] = useState("JYU");
    const [comments, setComments] = useState(globalComments);

    const commentTableRef = useRef(null);
    const delDocIdRef = useRef(null);
    

    //Editor area
    const editCommentBox = useRef(null);
    const editorBox = useRef(null);
    const regButton = useRef(null);
    const delButton = useRef(null);
    

    //table handlingfunction
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

    //Database handling
    async function insertDatabase(author, contents) {
        initializeApp(firebaseConfig);
        const db = getFirestore();

        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + "시 " + today.getMinutes() + "분";
        let dateTime = date + ' ' + time;

        let globalTime = today.getFullYear().toString()
            + (today.getMonth() + 1).toString()
            + today.getDate().toString()
            + today.getHours().toString()
            + today.getMinutes().toString();
            + today.getSeconds();
        let newId = globalTime + doc(collection(db, "gyujanggak")).id;

        try {
            await setDoc(doc(db, "gyujanggak", newId), {
                "Author": author,
                "Content": contents,
                "Date": dateTime,
            });
            console.log("Document written with ID: ", newId);

        } catch (e) {
            console.error("Error adding document: ", e);

        }
        //setComments([...comments, { "Author": author, "Content": contents, "Date": dateTime, "docId": newId }])
        setComments(await readDatabase());
    }

    async function deleteRow(localDelDocId) {
        initializeApp(firebaseConfig);
        const db = getFirestore();
        
        if (localDelDocId != null) {
            try {
                await deleteDoc(doc(db, "gyujanggak", localDelDocId));
                //setComments(comments.filter(items => items.docId != localDelDocId));
                console.log("Document delete with ID: ", localDelDocId);

            } catch (e) {
                console.error("Error removing document: ", e);

            }
        }

        setComments(await readDatabase());
    }

    useEffect(async () => {
        console.log("init");
        setComments(await readDatabase());

    },[]);

    useEffect(() => {
        console.log("setTable");
        setTable(comments);
        
    },[comments]);

    //Component did mount
    useEffect(() => {
        console.log("setButton actions");
        commentTableRef.current.querySelectorAll('tr').forEach(e => e.addEventListener("click", function settingButton() {
            console.log("button selected");
            console.log(delDocIdRef.current.innerHTML);
            console.log(this.children[2].innerHTML);

            if (delDocIdRef.current.innerHTML == this.children[2].innerHTML) {
                this.style.backgroundColor = "white";
                this.style.color = "black";
                regButton.current.style.display = "block";
                delButton.current.style.display = "none";
                delDocIdRef.current.innerHTML = "";

            } else if (delDocIdRef.current.innerHTML != this.children[2].innerHTML) {
                commentTableRef.current.querySelectorAll('tr').forEach(tr => { tr.style.backgroundColor = "white"; tr.style.color = "black" })
                this.style.backgroundColor = "rgb(166, 26, 26)";
                this.style.color = "white";
                regButton.current.style.display = "none";
                delButton.current.style.display = "block";
                delDocIdRef.current.innerHTML = this.children[2].innerHTML;
            }

            if (delDocIdRef.current.innerHTML != ""){
                editCommentBox.current.children[0].value = this.children[1].innerHTML;
                editorBox.current.children[0].value = this.children[0].children[0].innerHTML;

            }else{
                editCommentBox.current.children[0].value = "";
                editorBox.current.children[0].value = "";
                
            }
        }));

    }, [lines]);

    if (id == 'communication') {

        const handleContentsChange = event => {
            event.preventDefault();
            setContents(event.target.value);

        }

        const handleAuthorChange = event => {
            event.preventDefault();
            setAuthor(event.target.value);

        }

        const regDelComment = event => {
            event.preventDefault();

            if (delDocIdRef.current.innerHTML != "") {
                deleteRow(delDocIdRef.current.innerHTML);
                alert("성공적으로 삭제되었습니다.");

            } else {
                insertDatabase(defaultAuthor, defaultContents);
                alert("성공적으로 저장되었습니다.");

            }

            //reset all of status about delete and write.
            commentTableRef.current.querySelectorAll('tr').forEach(tr => {
                tr.style.backgroundColor = "white";
                tr.style.color = "black";
                regButton.current.style.display = "block";
                delButton.current.style.display = "none";
                delDocIdRef.current.innerHTML = "";

            })


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
                        <table className={pageStyles.communicationCommentsTable}>
                            <tbody>
                                "To-be Inserted"
                            </tbody>
                        </table>
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
                        <form onSubmit={regDelComment}>
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
                <CopyRight />
            </>
        )
    }else if(id == 'profile'){
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
                                    &nbsp;&nbsp;사소한 생활의 문제를 해결해주는 <br/>
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

    } else if(id == 'profile-mgmt'){
        let rows = "";
        const countOfRows = 14;
        for(let i = countOfRows; i > 0; i--){
            rows = rows 
                    + "<tr>" 
                    + data.rows[i].split("|").map(x => "<td>"+x+"</td>").toString().replace(/,/g,"") 
                    + "</tr>";
        }
        rows = parse(rows);

        return (
            <>
                
                <div className={profileDivTableStyles.profileDivTable} role="region" aria-labelledby="Caption01" tabindex="0">
                    <div className={profileDivTableStyles.profileDivTableTitle}>
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
                <CopyRight />
            </>
        )

    }else if(id == 'hobby'){
        let contents = "";
        
        //for canvas
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
            contents = contents + "<li><span>" + category + "</span><br/>";
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
                <CopyRight />
            </>
        )

    }
}
