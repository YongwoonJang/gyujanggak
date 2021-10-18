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
import { firebaseConfig } from '../../components/firebase';

import { setDoc, deleteDoc, collection } from "firebase/firestore";
import { doc, getDocs } from "firebase/firestore";

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

    const fullPath = "public/workExperience/" + params.id + ".md"
    let matterResult = {"data" : {"title":"Ready"},"content" : "내용 준비 중입니다."};

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
