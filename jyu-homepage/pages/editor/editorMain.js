import BookEditor from './bookEditor.js';
import BookList from './bookList.js';
import editorMainStyle from '/styles/editorMainStyle.module.scss'
import EditorMainHeadLine from './editorMainHeadLine.js';
import {getFirestore, collection, getDocs, doc, getDoc, orderBy, limit, query } from 'firebase/firestore';
import {getDownloadURL, getStorage, ref} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router.js';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

export async function getServerSideProps(context){
    let dataList = [];
    let queryResult, historyRef, contentRef, imageRef;
    
    try{
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore();
        const storage = getStorage();
        await signInWithEmailAndPassword(auth, process.env.USER_ID, process.env.CODE);
        const docSnap = await getDoc(doc(db, 'gyujanggak', process.env.USER_ID));
        const titleList = docSnap.data().collections;
        
        //get data per title.
        for (let i = 0; i < titleList.length; i++) {
            queryResult = query(collection(db, titleList[i]), orderBy("dateReturned", "desc"), limit(1));
            historyRef = await getDocs(queryResult);

            queryResult = doc(db, titleList[i], 'contents');
            contentRef = await getDoc(queryResult);

            imageRef = null;
            if (contentRef.data().image !== undefined) {
                imageRef = await getDownloadURL(ref(storage, contentRef.data().image));

            }

            historyRef.forEach((data) => {
                dataList.push(
                    {
                        "title": titleList[i],
                        "currentStatus": data.data().dateReturned,
                        "loanDate": data.data().dateLoaned,
                        "content": contentRef.data().review,
                        "image": (imageRef?imageRef:"")
                    }
                )
            })
        }

    }catch(e){
        console.log(e);

    }

    return {
        props: {
            data: dataList
        },
    }
    
}

export default function EditorMain(props){

    const [data, setData] = useState({
        "title":"",
        "currentStatus":"",
        "loanDate":"",
        "content":"",
        "image":null
    });
    const router = useRouter();
    
    useEffect(()=>{
        if(props.data == null){
            router.push({
                pathname: '/auth/login'

            });
        }
    });

    return(
        <>
            {
                (props.data !== null &&
                    ( 
                    <>
                        <div className={editorMainStyle.editorContainer}>
                            <div className={editorMainStyle.row}>
                                <EditorMainHeadLine/>
                            </div>
                            <div className={editorMainStyle.row}>
                                <div className={editorMainStyle.col}>
                                    <BookList value={props.data} selectedValue={data} onClick={(bookData)=>{setData(bookData)}} />
                                </div>
                                <div className={editorMainStyle.col}>
                                    <BookEditor value={data} onHandleChange={(newData)=>{setData(newData)}}/>
                                </div>
                            </div>
                        </div>
                    </>
                    )
                )
            }
        </>
    )
}
