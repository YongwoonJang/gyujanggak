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


//Database handling
async function insertDatabase(author, comments){
    initializeApp(firebaseConfig);
    const db = getFirestore();

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + "시 " + today.getMinutes() + "분";
    let dateTime = date + ' ' + time;
    let seconds = today.getSeconds();
    
    let globalTime = today.getFullYear().toString()
                        + (today.getMonth()+1).toString()
                        + today.getDate().toString()
                        + today.getHours().toString()
                        + today.getMinutes().toString();
    let newId = globalTime+seconds+doc(collection(db, "gyujanggak")).id;
    
    try {
        await setDoc(doc(db, "gyujanggak", newId), {
            "Author": author,
            "Content": comments,
            "Date": dateTime,
        });
        console.log("Document written with ID: ", newId);

    } catch (e) {
        console.error("Error adding document: ", e);

    }
}

async function readDatabase(){
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

async function deleteRow(delDocId){
    initializeApp(firebaseConfig);
    const db = getFirestore();
    if (delDocId != null){
        await deleteDoc(doc(db, "gyujanggak", delDocId));
        
    }

}

//Main function
export default function Post({id, data, contents, comments}){
    const content = parse(contents);
    //this line is used for comments
    let rows = "";
    const [lines, setLines] = useState(rows);

    //table handlingfunction
    const setTable = (comments) => {
        rows = "";
        for (let i = (comments.length - 1); i >= 0; i--) {
            rows = rows
                + "<tr>"
                + "<td>"
                + "<span>"
                + comments[i].Author
                + "</span>"
                + "<br/>"
                + comments[i].Date
                + "</td>"
                + "<td>"
                + comments[i].Content
                + "</td>"
                + "</tr>"
        }

        setLines(rows);
    }

    //Component did mount
    useEffect(async () => {
        rows = "";
        comments = await readDatabase();
        setTable(comments);
        

    }, []);

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

    }else if(id == 'profile-mgmt'){
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

    }else if(id == 'communication'){
        
        
        const [defaultContents, setContents] = useState("Hello world");
        const [defaultAuthor, setAuthor] = useState("JYU");
        const [delDocId, setDelDocId] = useState(null);
        const [delCommentIndex, setDelCommentIndex] = useState(null);
        
        const commentTableRef = useRef(null);
        const regButton = useRef(null);
        const delButton = useRef(null);
        const editCommentBox = useRef(null);
        const editorBox = useRef(null);
    
        //Make for button 
        useEffect(()=>{
            let rowsOfCommentTable = commentTableRef.current.children[0].children;
            
            for(let i = 0; i < rowsOfCommentTable.length; i ++){
                rowsOfCommentTable[i].addEventListener("click", function(){
        
                    if (delCommentIndex == (rowsOfCommentTable.length - 1) - i) {
                        rowsOfCommentTable[i].style.backgroundColor = "";
                        rowsOfCommentTable[i].style.color = "black";

                        regButton.current.style.display = "block";
                        delButton.current.style.display = "none";
                        
                        editCommentBox.current.children[0].value = "";
                        editorBox.current.children[0].value = "";

                        setDelDocId(null);
                        setDelCommentIndex(null);

                    }else{
                        for(let j = 0; j< rowsOfCommentTable.length; j++){
                            if((i != j) && (delCommentIndex != null)){
                                rowsOfCommentTable[j].style.backgroundColor = "";
                                rowsOfCommentTable[j].style.color = "black";

                                regButton.current.style.display = "block";
                                delButton.current.style.display = "none";
                                
                                editCommentBox.current.children[0].value = "";
                                editorBox.current.children[0].value = "";
                            }
                        }

                        if (delCommentIndex == null || delCommentIndex != (rowsOfCommentTable.length - 1) - i){
                            rowsOfCommentTable[i].style.backgroundColor = "rgb(166, 26, 26)";
                            rowsOfCommentTable[i].style.color = "white";
                            regButton.current.style.display = "none";
                            delButton.current.style.display = "block";

                            editCommentBox.current.children[0].value = comments[(rowsOfCommentTable.length-1)-i].Content;
                            editorBox.current.children[0].value = comments[(rowsOfCommentTable.length-1) - i].Author;

                            setDelDocId(comments[(rowsOfCommentTable.length-1) - i].docId);
                            setDelCommentIndex((rowsOfCommentTable.length - 1) - i);

                        } 
                    }
                    
                });
            }

        })
    
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
            
            if (regButton.current.style.display != "none"){
                let today = new Date();
                let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                let time = today.getHours() + "시 " + today.getMinutes() + "분";
                let dateTime = date + ' ' + time;

                insertDatabase(defaultAuthor, defaultContents);
                comments.push({"Author" : defaultAuthor, "Content" : defaultContents, "Date" : dateTime});
                setTable(comments);
                alert("성공적으로 저장되었습니다.");

            }else{
                
                if(delCommentIndex != null){
                    comments.splice(delCommentIndex,1);
                    setTable(comments);
                }

                deleteRow(delDocId);
                
                alert("성공적으로 삭제되었습니다.");
                setDelCommentIndex(null);
                setDelDocId(null);
                
            }

        }

        return(
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.communicationTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.communicationList}>
                        {parse(contents.replace(/\n/g,"<br/>"))} 
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
                                    <textarea id="comment" placeholder={defaultContents} onChange={handleContentsChange}/>
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
                        </form>
                    </div>
                </div>
                <CopyRight />
            </>
        )
    }
}
