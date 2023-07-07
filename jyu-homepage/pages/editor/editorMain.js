import { getApps } from 'firebase/app';
import { collection, getFirestore, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/router.js';

import EditorMainHeadLine from './editorMainHeadLine.js';
import BookEditor from './bookEditor.js';
import BookList from './bookList.js';

import editorMainStyle from '/styles/editorMainStyle.module.scss'

const baseURL = "https://gyujanggak.vercel.app"

    export async function getServerSideProps(){
        let dataList = [];
        await getDocs(collection(getFirestore(), 'bookList')).then((books)=>{
            books.forEach((book) => {
                dataList.push(Object.assign(book.data(), { "isbn": book.id }));
            })
            
        })
        return {
            props: {
                data: dataList
            }
        };
    }

export default function EditorMain(props){
    const router = useRouter();
    const [isLogin, setLogin] = useState(false);
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
    
    if(getApps().length != 0){
        onAuthStateChanged(getAuth(), (user) => {
            if(user){
                setLogin(true);

            }else{
                router.push("/auth/login");

            }
        })
    }else{
        router.push("/auth/login");

    }

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
                            <BookEditor selectBook={book} onSelectBookChange={(newData)=>selectBook(newData)} onHandleChange={(newData)=>{updateBookList(newData);}} baseURL={baseURL} />
        
                        </div>
                    </div>
                </div>
            :
                <div> 로그인이 필요한 페이지 입니다. </div>
            }
        </>
    )
    

}
