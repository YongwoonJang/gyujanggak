import fs from 'fs'

import { useState } from 'react'

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

import { addDoc, collection } from "firebase/firestore";
import { getDocs } from "firebase/firestore";

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

    return {
        props: {
            id: params.id,
            data: matterResult.data,
            contents: matterResult.content
        },
    }
}

async function insertDatabase(author, comments, dateTime){
    initializeApp(firebaseConfig);
    const db = getFirestore();

    try {
        const docRef = await addDoc(collection(db, "gyujanggak"), {
            "Author": author,
            "Content": comments,
            "Date": dateTime,
        });

        console.log("Document written with ID: ", docRef.id);

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
        //console.log(`${doc.id} => ${doc.data()}`);
        data.push(doc.data());
    });

    return data;
}

export default function Post({id, data, contents}){
    const content = parse(contents);

    //this line is used for comments
    let rows = "";
    let comments = [];
    const [lines, setLines] = useState(rows);

    //Component did mount
    useEffect(async () => {
        rows = "";
        comments = await readDatabase()
        for (let i = 0; i < comments.length; i++) {
            rows = rows
                + "<tr>"
                + "<td>"
                + comments[i].Date
                + "</td>"
                + "<td>"
                + comments[i].Author
                + "</td>"
                + "<td>"
                + comments[i].Content
                + "</td>"
                + "</tr>"
        }

        setLines(rows);

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
        

        const handleContentsChange = event => {
            event.preventDefault();
            setContents(event.target.value);
            
        }

        const handleAuthorChange = event => {
            event.preventDefault();
            setAuthor(event.target.value);

        }

        const registerComment = event => {
            event.preventDefault();
            let today = new Date();
            let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            let time = today.getHours() + "시 " + today.getMinutes() + "분";
            let dateTime = date + ' ' + time;

            insertDatabase(defaultAuthor, defaultContents, dateTime);
            comments.push({"Author" : defaultAuthor, "Content" : defaultContents, "Date" : dateTime});
            rows = "";
            for (let i = 0; i < comments.length; i++) {
                rows = rows
                    + "<tr>"
                    + "<td>"
                    + comments[i].Date
                    + "</td>"
                    + "<td>"
                    + comments[i].Author
                    + "</td>"
                    + "<td>"
                    + comments[i].Content
                    + "</td>"
                    + "</tr>"
            }
            setLines(rows);
            alert("성공적으로 저장되었습니다.");

        }

        return(
            <>
                <div className={pageStyles.page}>
                    <h1 className={pageStyles.communicationTitle}>
                        {parse(data.title)}
                    </h1>
                    <div className={pageStyles.communicationList}>
                        {parse(contents)} 
                    </div>
                    <div>
                        <div className={pageStyles.communicationComments}>
                            Comments
                        </div>
                        <table className={pageStyles.communicationCommentsTable}>
                            <tbody>
                                {parse(lines)}
                            </tbody>
                        </table>
                    </div>
                    <div className={pageStyles.communicationRegForm}>
                        <form onSubmit={registerComment}>
                            <div className={pageStyles.communicationRegComment}>
                                <div className={pageStyles.communicationRegCommentBox}>
                                    <textarea id="comment" placeholder={defaultContents} onChange={handleContentsChange}/>
                                </div>
                                <div className={pageStyles.communicationAuthorBox}>
                                    <input id="author" placeholder={defaultAuthor} onChange={handleAuthorChange} />
                                </div>
                                <div className={pageStyles.communicationRegButtonBox}>
                                    <button type="submit">게시  하기</button>
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
