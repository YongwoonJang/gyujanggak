
import { getDocs } from '@firebase/firestore';
import {useEffect, useState} from 'react';
import parse from 'html-react-parser';

import pageStyles from '/styles/page.module.scss'
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { firebaseConfig } from './firebase';


async function readDatabase(name) {
    initializeApp(firebaseConfig);
    const db = getFirestore();
    let data = [];

    const querySnapshot = await getDocs(collection(db, name));
    querySnapshot.forEach((doc) => {
        let tempObject = doc.data();
        tempObject["docId"] = doc.id;
        data.push(tempObject);
    })

    return data;

}

export default function CommentTable(props){
    
    const [lines, setLines] = useState("");
    const [history, setHistory] = useState([{"dateLoaned":"Loading","dateReturned":"Loading","nameOfBorrower":"Loading"}]);

    const setTable = (localHistory) => {
        if (localHistory != null) {
            let rows = "";
            for (let i = (localHistory.length - 1); i >= 0; i--) {
                rows = rows
                    + "<tr>"
                    + "<td>"
                    + localHistory[i].dateLoaned
                    + "</td>"
                    + "<td>"
                    + localHistory[i].dateReturned
                    + "</td>"
                    + "<td>"
                    + localHistory[i].nameOfBorrower
                    + "</td>"
                    + "<td style='display:none'>"
                    + localHistory[i].docId
                    + "</td>"
                    + "</tr>"
            }

            setLines(rows);
        }
    }

    useEffect(async () => {
        setHistory(await readDatabase(props.name));
    },[]);

    useEffect(() => {
        setTable(history);

    },[history])

    return (
        <>
            <div>
                <div className={pageStyles.history}>
                    History
                </div>
                <table className={pageStyles.historyTable}>
                    <thead>
                        <th>대출일</th>
                        <th>반납일</th>
                        <th>빌린사람</th>
                    </thead>
                    <tbody>
                        {parse(lines)}
                    </tbody>
                </table>
            </div>
        </>
    )

}