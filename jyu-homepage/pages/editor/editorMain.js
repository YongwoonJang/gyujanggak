import { getApps } from 'firebase/app';
import { collection, getFirestore, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import EditorMainHeadLine from './editorMainHeadLine.js';
import BookEditor from './bookEditor.js';
import BookList from './bookList.js';

import editorMainStyle from '/styles/editorMainStyle.module.scss'

const baseURL = "https://gyujanggak.vercel.app"

export default function EditorMain(){
    const router = useRouter();
    const [isLogin, setLogin] = useState(false);
    const [bookList, setBookList] = useState(null);
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

    useEffect(()=>{
        if (getApps().length != 0) {
            onAuthStateChanged(getAuth(), async (user) => {
                if (user) {                    
                    setLogin(true);
                    const list = []
                    await getDocs(collection(getFirestore(), 'bookList')).then((books) => {
                            books.forEach((book) => {
                                list.push(Object.assign(book.data(), { "isbn": book.id }));
                            })
                        }
                    )
                    console.log(bookList);
                    setBookList(list);
                }
            })
            
        }else{
            router.push('/auth/login');

        }
    },[])

    const updateBookList = (newData) => {
        bookList.forEach((book)=>{
            if(book.title == newData.title){
                Object.keys(newData).forEach((key)=>{
                    book[key] = newData[key];
                })
            }
        })
    }
    
    
    return(
        <>
            {(isLogin != false && bookList != null)?
                <div className={editorMainStyle.editorContainer}>
                    <div className={editorMainStyle.row}>
                        <EditorMainHeadLine/>
                    </div>
                    <div className={editorMainStyle.row}>
                        <div className={editorMainStyle.col}>
                            <BookList bookList={bookList} selectBook={book} onClick={(bookData)=>{selectBook(bookData)}} />
                        </div>
                        <div className={editorMainStyle.col}>
                            <BookEditor selectBook={book} onSelectBookChange={(newData)=>selectBook(newData)} onHandleChange={(newData)=>{updateBookList(newData);}} baseURL={baseURL} />
        
                        </div>
                    </div>
                </div>
            :
                <div> 페이지를 로딩 중입니다. </div>
            }
        </>
    )
    

}
