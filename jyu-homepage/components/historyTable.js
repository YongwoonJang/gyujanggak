
import {useEffect, useState} from 'react';
import parse from 'html-react-parser';
import pageStyles from '/styles/page.module.scss'

import {readDatabase} from './databaseUtils'

const setTable = (localHistory, setLines) => {
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

export default function HistoryTable(props){
    
    const [lines, setLines] = useState("");
    const [history, setHistory] = useState([{"dateLoaned":"Loading","dateReturned":"Loading","nameOfBorrower":"Loading"}]);

    useEffect(async () => {
        setHistory(await readDatabase(props.name));

    },[]);

    useEffect(() => {
        setTable(history, setLines);

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