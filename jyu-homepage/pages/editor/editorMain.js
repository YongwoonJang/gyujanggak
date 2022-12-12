import { doc, getFirestore, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router.js';

import EditorMainHeadLine from './editorMainHeadLine.js';
import BookEditor from './bookEditor.js';
import BookList from './bookList.js';

import editorMainStyle from '/styles/editorMainStyle.module.scss'

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    appId: process.env.APP_ID,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET
    
};

const baseURL = "https://gyujanggak.vercel.app"
// const baseURL = "http://localhost:3000"

export async function getServerSideProps(context){
    let dataList = [];
    
    try{
        initializeApp(firebaseConfig);
        const auth = getAuth();
        const db = getFirestore();
        
        
        await signInWithEmailAndPassword(auth, process.env.USER_ID, process.env.CODE);

        const titleSnap = await getDoc(doc(db, 'info', 'titleList'));
        const titleList = titleSnap.data().title;

        let bookInfo, loanHistory;
        for (let i = 0; i < titleList.length; i++){
            bookInfo = await getDoc(doc(db, titleList[i], 'contents'));
            loanHistory = await getDoc(doc(db, titleList[i], 'loanHistory'));
            dataList.push(Object.assign(bookInfo.data(), {"list":loanHistory.data().list }));
            
        }

        return {
            props: {
                data: dataList
            },
        }
        
    }catch(e){
        console.log(e);
        
    }
    return {
        props: {
            data: null
        }
    };
}

export default function EditorMain(props){
    const [book, selectBook] = useState(
        {
            "title":"",
            "subtitle":"",
            "author":"",
            "publishDate":"",
            "review":"",
            "image":""

        }
    );
    const [userId, setUserId] = useState(null);
    const [isLogin, setLoginStatus] = useState(false);
    const router = useRouter();
    
    useEffect(()=>{
        try{
            const auth = getAuth();
            onAuthStateChanged(auth, (user)=>{
                setLoginStatus(true);
                setUserId(user.id);
                
            })
            
        }catch(e){
            console.log(e);
            router.push("/auth/login");

        }

    })

    const updateBookList = (newData) => {
        props.data.forEach((book)=>{
            if(book.title == newData.title){
                Object.keys(newData).forEach((key)=>{
                    book[key] = newData[key];
                })
            }
        })
    }
    
    if (isLogin!=false && props.data!=null){
        return(
            <>
                <div className={editorMainStyle.editorContainer}>
                    <div className={editorMainStyle.row}>
                        <EditorMainHeadLine/>
                    </div>
                    <div className={editorMainStyle.row}>
                        <div className={editorMainStyle.col}>
                            <BookList bookList={props.data} selectBook={book} onClick={(bookData)=>{selectBook(bookData)}} />
                        </div>
                        <div className={editorMainStyle.col}>
                            <BookEditor selectBook={book} onSelectBookChange={(newData)=>selectBook(newData)} onHandleChange={(newData)=>{updateBookList(newData);}} baseURL={baseURL} userId={userId}/>
        
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return(
        <>
            <div> 로그인이 필요한 페이지 입니다. </div>
        </>
    )
}
