import pageStyles from '/styles/page.module.scss'
import CopyRight from '../../components/copyRight'
import HistoryTable from '../../components/historyTable'

import Head from 'next/head';

import { useEffect, useState } from 'react';
import { getFirestore, getDocs, getDoc, doc, collection } from 'firebase/firestore';

import utf8 from "utf8";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig, identification } from "../../components/firebaseConfig"

export async function getStaticPaths(){
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, identification["user"], identification["code"]);
    const docList = await getDocs(collection(db, "bookList"));
    let paths = [];
    docList.forEach((doc)=>{
        paths.push({params : {id:doc.id}});
    });

    return {
        paths: paths,
        fallback: "blocking",
    }



}

export async function getStaticProps({params}){
    let db, auth, docs;

    try{
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);    
        auth = getAuth(app);
        await signInWithEmailAndPassword(auth, identification["user"], identification["code"]);
        docs = await getDoc(doc(db, "bookList", params.id));

    }catch(e){
        db = getFirestore();
        docs = await getDoc(doc(db, "bookList", params.id));

    }

    return {
        props: {book: docs.data(), id: params.id}
        
    }
}

//Main function
export default function books(props) {

    const [book, setBook] = useState(null);
    const [loanHistory, setLoanHistory] = useState(null);

    useEffect(()=>{
        setLoanHistory(props.book.loanHistory);
        setBook(props.book); 
               
    }, [])

    let imagePart = "";
    if(book != null){
        imagePart = <img src={book.image} className={pageStyles.bookImage} width={25+'%'} height={100+"%"} layout="responsive" />;

    }

    return (
        <>  
            
            <Head>
                {/* <title>{"Yongwoon's book: " + book.title}</title> */}
                <meta property="og:url" content={"https://gyujanggak.vercel.app"} />
                <meta property="og:type" content="website" />
                {/* <meta property="og:title" content={"Royal's garage: " + book.title} />
                <meta property="og:description" content={utf8.decode(book.review)} />
                <meta property="og:image" content={book.image} />
                <meta property="og:image:secure_url" content={book.image} /> */}
                {/* <meta name="keywords" content={"책," + book.title + "," + book.author} /> */}
                <meta property="og:title" content="YongwoonJang's Creative Home" />
                <meta property="og:description" content="피아노, 프로그래밍, 플라모델, 수영, 영어를 사랑하는 서울사는 장용운의 이야기입니다." />
                <meta property="og:image" content="https://gyujanggak.vercel.app/profile.png" />
                <meta property="og:image:secure_url" content="https://gyujanggak.vercel.app/profile.png" />
            </Head>
            
            { book && 
                <>  
                    <div className={pageStyles.page}>
                        <h1 className={pageStyles.bookTitle}>
                            {book.title}
                        </h1>
                        <div className={pageStyles.opinionBox}>
                            {imagePart}
                            <div className={pageStyles.opinion}>
                            {utf8.decode(book.review)}
                            </div>
                        </div>
                        <div className={pageStyles.loanButton}>
                            <a href={book.loanButton}>빌리기</a>
                        </div>
                        <HistoryTable loanHistory={loanHistory}/>
                    </div>
                    <div>
                        <CopyRight />
                    </div>
                </>
            }
        </>
    )
}
