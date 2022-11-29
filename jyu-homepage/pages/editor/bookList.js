import bookListStyle from '/styles/bookListStyle.module.scss';

export default function BookList(props){
    
    let contents = [];

    const handleClick = (index) => {
        props.onClick(props.value[index]);
    }

    if (props.value !== undefined) {
        props.value.forEach((data) => {
            contents.push(
                <tr className={bookListStyle.row} key={"bookList-button-"+props.value.indexOf(data)}>
                    <td>
                        <button 
                            className={`${bookListStyle.button} ${props.selectedValue==data?bookListStyle.clicked:bookListStyle.none}`}
                            onClick={(()=>{handleClick(props.value.indexOf(data))})}>
                            <div>{data.title}</div>
                            <div className={(data.currentStatus !== "독서중" ? bookListStyle.green : bookListStyle.red)}>{(data.currentStatus !== "독서중" ? "대출가능" : "독서 중")}</div>
                            <div>{'최근 "' + data.loanDate + '"에 대출'}</div>
                        </button>
                    </td>
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