import bookListStyle from '/styles/bookListStyle.module.scss';
import { useState, useEffect } from 'react';

export default function BookList(props){
    
    const [contents, setContents] = useState(null);
    let contentsList = [];

    useEffect(()=>{
        console.log(props.value);
        if (props.data !== undefined) {
            props.value.forEach((data) => {
                contentsList.push(
                    <tr className={bookListStyle.row}>
                        <td>{data.title}</td>
                        <td className={(data.currentStatus !== "독서중" ? bookListStyle.green : bookListStyle.red)}>{(data.currentStatus !== "독서중" ? "대출가능" : "독서 중")}</td>
                        <td>{'최근 "' + data.loanDate + '"에 대출'}</td>
                    </tr>
                )
            })

            setContents(contentsList);
        }
    },props.value)

    return(
        <>
            <div className={bookListStyle.bookListContainer}>
                <table>
                    <tbody>
                        {contents}
                    </tbody>
                </table>
            </div>
        </>
    )
}