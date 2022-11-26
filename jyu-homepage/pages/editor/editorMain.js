import BookEditor from './bookEditor.js';
import BookList from './bookList.js';
import editorMainStyle from '/styles/editorMainStyle.module.scss'
import EditorMainHeadLine from './editorMainHeadLine.js';
import {getFirestore, collection, getDocs, doc, getDoc, orderBy, limit, query } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router.js';


const firebaseConfig = {
    apiKey: "AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0",
    authDomain: "gyujanggak-99e8a.firebaseapp.com",
    databaseURL: "https://gyujanggak-99e8a-default-rtdb.firebaseio.com",
    projectId: "gyujanggak-99e8a",
    storageBucket: "gyujanggak-99e8a.appspot.com",
    messagingSenderId: "442347175475",
    appId: "1:442347175475:web:ea5374ac2d0c8458972d46"
};

export async function getServerSideProps(context){
    let dataList = [];
    let titleList = [];
    let q, docRef;
    
    try{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore();
        const auth = getAuth(app);
        await signInWithEmailAndPassword(auth, process.env.USER_ID, process.env.CODE);
        const docSnap = await getDoc(doc(db, 'gyujanggak', 'royalfamily89@gmail.com'));
        const collectionList = docSnap.data().collections;
        collectionList.forEach((title) => {
            titleList.push(title);

        })
        
        for (let i = 0; i < titleList.length; i++) {
            q = query(collection(db, titleList[i]), orderBy("dateReturned", "desc"), limit(1));
            docRef = await getDocs(q);
            docRef.forEach((data) => {
                dataList.push(
                    {
                        "title": titleList[i],
                        "currentStatus": data.data().dateReturned,
                        "loanDate": data.data().dateLoaned
                    }
                )
            })
        }

        console.log(dataList);

    }catch(e){
        console.log(e);

        return {
            props: {
                data: null,
            },
        }
    }

    return {
        props: {
            data: dataList
        },
    }
    
}

export default function EditorMain(props){

    const router = useRouter();
    const [data, setData] = useState();
    
    useEffect(()=>{

        if(props.data == null){
            router.push({
                pathname: '/auth/login'

            });
        }

        console.log(props.data);
        setData(props.data);

    },props.data);

    return(
        <>
            {
                (props.data !== null) && 
                ( 
                    <>
                        <div className={editorMainStyle.editorContainer}>
                            <div className={editorMainStyle.row}>
                                <EditorMainHeadLine/>
                            </div>
                            <div className={editorMainStyle.row}>
                                <div className={editorMainStyle.col}>
                                    <BookList value={data} />
                                </div>
                                <div className={editorMainStyle.col}>
                                    <BookEditor />
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}
