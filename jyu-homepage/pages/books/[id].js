import pageStyles from '/styles/page.module.scss'
import CopyRight from '../../components/copyRight'
import HistoryTable from '../../components/historyTable'

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getFirestore, getDoc, doc } from 'firebase/firestore';

import utf8 from "utf8";

//Main function
export default function books() {

    const [book, setBook] = useState(null);
    const [loanHistory, setLoanHistory] = useState(null);
    const router = useRouter();

    useEffect(async ()=>{
        const { id } = router.query;
        try{
            const db = getFirestore();
            const bookSnap = await getDoc(doc(db, "bookList", id));
            setLoanHistory(bookSnap.data().loanHistory);
            setBook(bookSnap.data());
            

        }catch(e){
            console.log(e);
            router.push("/");
        
        } 
    }, [])


    
    let imagePart = "";
    if(book != null){
        imagePart = <img src={book.image} className={pageStyles.bookImage} width={25+'%'} height={100+"%"} layout="responsive" />;

    }

    return (
        <>
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
                            <a href={book.loanButton}>대출 하기</a>
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
