import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import pageStyles from '/styles/page.module.scss'

// firebase
import { initializeApp } from 'firebase/app'
import { getDocs, getFirestore, collection } from 'firebase/firestore';

// Component
import CommentTable from '../components/commentTable'
import sortBookListByTitle from '../components/utils';
import WorkExperience from './workExperiences/workExperience';

import utf8 from "utf8";

export default function Main(){

    const [bookList, setBookList] = useState(null);
    const [bookPreviewList, setBookPreviewList ] = useState(null);
    const [isText, setIsText] = useState(false);
    const [filter, setFilter] = useState("");
    const [isFocus, setFocus] = useState(false);
    
    let app = null, db = null;

    const firebaseConfig = {
        apiKey: "AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0",
        authDomain: "gyujanggak-99e8a.firebaseapp.com",
        projectId: "gyujanggak-99e8a"
    }

    try{
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        
    }catch(e){
        console.log("Error in communication component!!");
        console.log(e);

    }

    useEffect(()=>{
        window.addEventListener('scroll', (event)=>{
            if(document.documentElement.scrollTop > 50){
                setFocus(true);
                
            }else{
                setFocus(false);

            }
        });

    });
    
    //Load List
    useEffect(async ()=>{

        let books = null;

        try{        
            books = await getDocs(collection(db, "bookList"));
            console.log("books: ", books.docs.length);
            console.log("app: " + app);
            console.log("db: " + db);

        }catch(e){
            console.log(e);

        }
        const sortBooks = sortBookListByTitle(books);

        let descList = [], imgList = [];

        sortBooks.forEach((book)=>{
            descList.push(
                <li key={book.data().title}>
                    <Link href={"/book/" + book.id}>
                        {book.data().title + " (" + book.data().publishDate + ", " + book.data().author + ")"}
                    </Link>
                </li>);
        });

        sortBooks.forEach((book)=>{
            imgList.push(
                <div className={pageStyles.bookImgFrame}>
                    <Link href={"/book/" + book.id}>
                        <a>
                            <img
                                src={book.data().image}
                                alt={book.data().title}
                            />
                            <div>
                                {utf8.decode(book.data().review).slice(0,40)+"..."}
                            </div>
                        </a>
                    </Link>
                </div>
            )
        })

        setBookList(descList);
        setBookPreviewList(imgList);
        
    },[])

    useEffect(()=>{
        let loadingDot = 1;
        let dots = "."
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

    const promptActionHandler = (event) => {
        setFilter(event.target.value);
    }

    return(
        <>
            <div className={isFocus?`${pageStyles.comBannerGroup} ${pageStyles.comBannerGroupFocus}`:`${pageStyles.comBannerGroup}`}>
                <div className={isFocus ? `${pageStyles.comBannerGroupInputGroupFocus}`:`${pageStyles.comBannerGroupInputGroup}`}>
                    <div>
                        <label className={isFocus ? `${pageStyles.comBannerGroupLabel} ${pageStyles.comBannerGroupLabelFocus}` : `${pageStyles.comBannerGroupLabel}`}>
                            <a href="/workExperiences/workExperience">장용운</a>'s Archive: 
                        </label>
                    </div>
                    <div>
                        <input 
                            onChange={promptActionHandler} 
                            className={pageStyles.comBannerGroupInput} 
                            placeholder="책 이름, 장용운, 채팅 중 하나를 써보세요"
                        />
                        <span className={pageStyles.comBannerGroupInputBar} />
                    </div>
                </div>
            </div>
            {bookList === null ? 
                <div id="loading" className={pageStyles.bookGroupSectionLoading}>좋아하는 것을 불러오고 있습니다.</div> :
                <>
                    <div className={isFocus?`${pageStyles.bookGroupSection} ${pageStyles.bookGroupSectionFocus}`:`${pageStyles.bookGroupSection}`}>
                        <div className={pageStyles.bookBox}>
                            {isText?
                                <>
                                    <ul className={pageStyles.bookTitleList}>
                                        <div>{bookList}</div>
                                    </ul>
                                </>:
                                <>
                                    
                                    {
                                        bookPreviewList
                                        &&
                                        (
                                            bookPreviewList
                                            .filter(e =>  
                                                e.props.children.props.children.props.children[0].props.alt.toLowerCase().includes(filter.toLowerCase())).length === 0 ?
                                                ((filter.toLowerCase() == "chating" | filter.toLowerCase() == "chat" | filter.toLowerCase() == "채팅" | filter.toLowerCase() === "장용운")?"":<div className={pageStyles.bookImgWaitingText}>"원하는 책이 없네욤"</div>)
                                                : bookPreviewList.filter(e => e.props.children.props.children.props.children[0].props.alt.toLowerCase().includes(filter.toLowerCase()))
                                        )
                                    }
                                </>
                            }
                        </div>
                        <div className={pageStyles.bookBoxButton}>
                            <button onClick={() => { setIsText(!isText) }}>{isText ? "Image mode" : "Text mode"}</button>
                        </div>
                    </div>
                    <div>
                        {
                            (filter.toLowerCase() == "chating" | filter.toLowerCase() == "chat" | filter.toLowerCase() == "채팅")?
                            <CommentTable app={app} section="chats" />:""
                        }
                    </div>
                    <div>
                        {(filter === "장용운"?<WorkExperience/>:"")}
                    </div>
                </>
            }
        </>
    )
};