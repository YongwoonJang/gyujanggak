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
                <title>{"Yongwoon's book: " + props.book.title}</title>
                <meta property="og:url" content={"https://gyujanggak.vercel.app/books/"+props.book.isbn} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={"Royal's garage: " + props.book.title} />
                <meta property="og:description" content={utf8.decode(props.book.review)} />
                <meta property="og:image" content={props.book.image} />
                <meta property="og:image:secure_url" content={props.book.image} /> 
                <meta name="keywords" content={"책," + props.book.title + "," + props.book.author}/>
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
