
import { getDocs, getFirestore, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import pageStyles from '/styles/page.module.scss'

// firebase
import { initializeApp } from 'firebase/app'
import { signOut, signInWithEmailAndPassword, getAuth, onAuthStateChanged, setPersistence, inMemoryPersistence } from 'firebase/auth'


// Component
import CommentTable from '../../../components/commentTable'
import sortBookListByTitle from '../../../components/utils';
import { identification } from '../../../components/firebaseConfig';

export default function Communication(){

    const [bookList, setBookList] = useState(null);
    const [bookPreviewList, setBookPreviewList ] = useState(null);
    const [isText, setIsText] = useState(false);

    const firebaseConfig = {
        apiKey: "AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0",
        authDomain: "gyujanggak-99e8a.firebaseapp.com",
        projectId: "gyujanggak-99e8a"
    }
    const app = initializeApp(firebaseConfig);
    

    useEffect(async()=>{
        const db = getFirestore();
        const auth = getAuth();
        await setPersistence(auth, inMemoryPersistence); 
        
        let credential = null;

        onAuthStateChanged(auth, (credit) => {credential = credit;});

        if(credential === null){
            await signInWithEmailAndPassword(auth, identification["user"], identification["code"])
                .then(() => {
                    console.log("login success");
                })
                .catch((error) => {
                    console.log(error);

                });
        }
        
        const books = await getDocs(collection(db, "bookList"));
        const sortBooks = sortBookListByTitle(books);

        let elements = [];
        sortBooks.forEach((book)=>{
            elements.push(
                <li key={book.data().title}>
                    <Link href={"/books/" + book.id}>
                        {book.data().title + " (" + book.data().publishDate + ", " + book.data().author + ")"}
                    </Link>
                </li>);
        });

        let previewList = [];
        sortBooks.forEach((book)=>{
            previewList.push(
                <div className={pageStyles.bookImgFrame}>
                    <Link href={"/books/" + book.id}>
                        <img
                            src={book.data().image}
                            alt={book.data().title}
                        />
                    </Link>
                </div>
            )
        })

        setBookList(elements);
        setBookPreviewList(previewList);
        
        return async () => {
            await signOut(auth)
            .then(()=>{console.log("logout success")})
            .catch((error)=>{
                console.log(error);
            });
        }
        
    },[])


    let loadingDot = 1;
    let dots = ".";
    useEffect(()=>{
        const doc = document.getElementById("loading");
        if(doc != null){
            const interval = setInterval(()=>{
                dots = ".".concat(".");
                doc.innerHTML += dots;
                loadingDot ++;

                if(loadingDot > 10){
                    doc.innerHTML = "다시 접속해 주세요.^^";
                    loadingDot = 1;
                }


            },1000)

            return () => clearInterval(interval);
        }

    },[])

    return(
        <>
            {/* main title and description */ }
            <div className={pageStyles.communicationMainBackgroundImage}>
                <div className={pageStyles.communicationTitleGroup}>
                    <div className={pageStyles.communicationTitle}>
                        Y<span>ongwoon's creative garage</span>
                    </div>
                    <div className={pageStyles.communicationMotto}>
                        <span>안녕하세요.</span><br/><br/>
                        <span>제가 좋아하는 것들을 모아두었습니다.</span><br /><br />
                        <span>인스타그램 <a href="https://www.instagram.com/minor_gyujanggak/" target="__blank"> @minor_gyujanggak </a></span><br />
                    </div>
                </div>
            </div>
            {bookList === null ? 
                <div id="loading" className={pageStyles.bookGroupSectionLoading}>좋아하는 것을 불러오고 있습니다.</div> :
                <>
                    <div className={pageStyles.bookGroupSection}>
                        <div className={pageStyles.bookBox}>
                            {isText?
                                <>
                                    <ul className={pageStyles.bookTitleList}>
                                        <div>{bookList}</div>
                                    </ul>
                                </>:
                                <>
                                    {bookPreviewList}
                                </>
                            }
                        </div>
                        <div className={pageStyles.bookBoxButton}>
                            <button onClick={() => { setIsText(!isText) }}>{isText ? "Image mode" : "Text mode"}</button>
                        </div>
                    </div>
                    <div>
                        <CommentTable app={app} section="chats" />
                    </div>
                </>
            }
        </>
    )
};