import bookListStyle from '/styles/bookListStyle.module.scss';

export default function BookList(props){
    
    let contents = [];

    if (props.value !== undefined) {
        props.value.forEach((data) => {
            contents.push(
                <tr className={bookListStyle.row}>
                    <td>{data.title}</td>
                    <td className={(data.currentStatus !== "독서중" ? bookListStyle.green : bookListStyle.red)}>{(data.currentStatus !== "독서중" ? "대출가능" : "독서 중")}</td>
                    <td>{'최근 "' + data.loanDate + '"에 대출'}</td>
                </tr>
            )
        })
    }

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