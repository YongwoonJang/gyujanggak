import { collection, getFirestore, getDocs } from 'firebase/firestore';
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

export async function getServerSideProps(){
    let dataList = [];
    let db, auth;
    
    try{
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        
    }catch(e){
        console.log("error occur from getServerSideProps: ");
        db = getFirestore();
        auth = getAuth();
        console.log(e);
        
    }

    await signInWithEmailAndPassword(auth, process.env.USER_ID, process.env.CODE);
    const books = await getDocs(collection(db, 'bookList'));
    books.forEach((book) => {
        dataList.push(Object.assign(book.data(), { "isbn": book.id }));
    })

    return {
        props: {
            data: dataList
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
            "isbn":"",
            "review":"",
            "image":""

        }
    );
    const [userId, setUserId] = useState(null);
    const [isLogin, setLoginStatus] = useState(false);
    const router = useRouter();
    
    useEffect(()=>{
        console.log("is login value is : "+isLogin);
        console.log("props.data is :"+props.data);

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
    
    
    return(
        <>
            {(isLogin != false && props.data != null)?
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
            :
                <div> 로그인이 필요한 페이지 입니다. </div>
            }
        </>
    )
    

}
