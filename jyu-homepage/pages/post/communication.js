
import { getDoc, getFirestore, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import pageStyles from '/styles/page.module.scss'



export default function Communication(props){

    const [bookList, setBookList] = useState(null);

    useEffect(async()=>{
        let bookList = [];
        const db = getFirestore(props.app);
        const titleRef = await getDoc(doc(db, "info", "titleList"));
        const titleList = titleRef.data().title;

        for (let i = 0; i < titleList.length; i++) {
            const contentsRef = await getDoc(doc(db, titleList[i], "contents"));
            bookList.push(contentsRef.data());
        }

        let elements = bookList.map((element)=>{
            return (
                <li key={element.title}>
                    <Link href={"/books/"+element.title}>
                        {element.title + " (" + element.publishDate + ", " + element.author + ")"}
                    </Link>
                </li>
            )

        })

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
        </>
    )
};