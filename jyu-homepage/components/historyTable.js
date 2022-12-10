
import {useEffect, useState} from 'react';
import pageStyles from '/styles/page.module.scss'

const setTable = (localHistory) => {
    if (localHistory != null) {
        let rows = [];
        localHistory.forEach((element)=>{
            rows.push(
                <tr>
                    <td>{element.loanDate}</td>
                    <td>{element.returnDate}</td>
                    <td>{element.borrower}</td>
                </tr>
            )
        })
        return rows;

    }else{
        return null;

    }
}

export default function HistoryTable(props){
    
    const [loanHistory, setLoanHistory] = useState(null);

    useEffect(() => {
        setLoanHistory(setTable(props.loanHistory));

    })

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
                        {loanHistory}
                    </tbody>
                </table>
            </div>
        </>
    )

}