import fs from 'fs'

import { useState, useRef, useCallback } from 'react'

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
import { firebaseConfigForBook } from '../../components/firebase';

import { setDoc, deleteDoc, collection } from "firebase/firestore";
import { doc, getDocs } from "firebase/firestore";

async function readDatabase() {
    initializeApp(firebaseConfig);
    const db = getFirestore();


}


//Static function
export function getStaticPaths() {
    const postNames = ["WhenAttitudesBecomeArtwork"]

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
export default function workExperiences({ data, contents }) {
    const commentTableRef = useRef(null);
    const editCommentBox = useRef(null);
    const editorBox = useRef(null);
    const regButton = useRef(null);
    const delButton = useRef(null);

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
            {/* 댓글 기능 */}
            {/* <div>
                <div className={pageStyles.Comments}>
                    Comments
                </div>
                <table ref={commentTableRef} className={pageStyles.CommentsTable}>
                    <tbody>
                        {parse(lines)}
                    </tbody>
                </table>
            </div>
            <div className={pageStyles.RegForm}>
                <form onSubmit={regDelComment}>
                    <div className={pageStyles.RegComment}>
                        <div ref={editCommentBox} className={pageStyles.RegCommentBox}>
                            <textarea id="comment" placeholder={defaultContents} onChange={handleContentsChange} />
                        </div>
                        <div ref={editorBox} className={pageStyles.AuthorBox}>
                            <input id="author" placeholder={defaultAuthor} onChange={handleAuthorChange} />
                        </div>
                        <div ref={regButton} className={pageStyles.RegButtonBox}>
                            <button type="submit">게시  하기</button>
                        </div>
                        <div ref={delButton} className={pageStyles.DelButtonBox}>
                            <button type="submit">삭제  하기</button>
                        </div>
                    </div>
                    <div ref={delDocIdRef} style={{ display: "none" }}></div>
                </form>
            </div> */}
        </>
    )
}
