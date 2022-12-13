
import { getDocs, getFirestore, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import pageStyles from '/styles/page.module.scss'

// firebase
import { initializeApp } from 'firebase/app'
import { signIn } from '../../components/databaseUtils'

// Component
import CommentTable from '../../components/commentTable'


export default function Communication(){

    const [bookList, setBookList] = useState(null);

    const firebaseConfig = {
        apiKey: "AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0",
        authDomain: "gyujanggak-99e8a.firebaseapp.com",
        projectId: "gyujanggak-99e8a"
    }
    const app = initializeApp(firebaseConfig);
    signIn(app);

    useEffect(async()=>{
        const db = getFirestore();
        const books = await getDocs(collection(db, "bookList"));
        let elements = [];
        books.forEach((book)=>{
            elements.push(
                <li key={book.data().title}>
                    <Link href={"/books/" + book.data().title}>
                        {book.data().title + " (" + book.data().publishDate + ", " + book.data().author + ")"}
                    </Link>
                </li>);
        });

        setBookList(elements);
        
    },[])

    return(
        <>
            {/* main title and description */ }
            <div className={pageStyles.communicationMainBackgroundImage}>
                <div className={pageStyles.communicationTitleGroup}>
                    <div className={pageStyles.communicationTitle}>
                        M<span>inor gyujanggak</span>
                    </div>
                    <div className={pageStyles.communicationMotto}>
                        <span>안녕하세요.</span><br/><br/>
                        <span>개인 책 대여점 "minor gyujanggak"입니다.</span><br /><br />
                        <span>책에 자유롭게 연필과 펜으로 기록을 남길 수 있습니다.</span><br /><br />
                        <span>대여를 원하는 책 이름을 <a href="#books">"Books"</a>에서 찾아 클릭해 주세요.</span><br /><br />
                        <span>소통 채널은 <a href="#comments">"Comments"</a>와 인스타그램 <a href="https://www.instagram.com/minor_gyujanggak/" target="__blank"> @minor_gyujanggak </a> 입니다.</span><br />
                    </div>
                </div>
            </div>
            <div className={pageStyles.bookGroupSection}>
                <div className={pageStyles.sectionTitle}>
                    Books
                </div>
                <div className={pageStyles.bookTitleBox}>
                    <ul className={pageStyles.bookTitleList}>
                        {bookList == null?<div>Loading</div>:<div>{bookList}</div>}
                    </ul>
                </div>
            </div>
            <div>
                <CommentTable app={app} section="chats" />
            </div>
        </>
    )
};