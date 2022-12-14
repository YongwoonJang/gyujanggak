import bookListStyle from '/styles/bookListStyle.module.scss';

export default function BookList(props){
    
    

    const handleClick = (current) => {
        if(props.bookList[current] != props.selectBook){
            props.onClick(props.bookList[current]);
        
        }else{
            props.onClick({
                "title": "",
                "subtitle": "",
                "author": "",
                "isbn": "",
                "publishDate": "",
                "review": "",
                "image": "",
                "loanHistory":[]
            });

        }
    }

    let bookList = [];
    if(props.bookList != null){
        props.bookList.forEach((book) => {
            bookList.push(
                <tr className={bookListStyle.row} key={"bookList-button-" + props.bookList.indexOf(book)}>
                    <td>
                        <button
                            className={`${bookListStyle.button} ${props.selectBook == book ? bookListStyle.clicked : bookListStyle.none}`}
                            onClick={(() => { handleClick(props.bookList.indexOf(book)) })}>
                            <div>{book.title}</div>
                            <div className={(book.loanHistory.at(-1).returnDate !== "null" ? bookListStyle.green : bookListStyle.red)}>{(book.loanHistory.at(-1).returnDate !== "null" ? "대출가능" : "독서 중")}</div>
                            <div>{'최근 "' + book.loanHistory.at(-1).loanDate + '"에 대출'}</div>
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
                        {bookList}
                    </tbody>
                </table>
            </div>
        </>
    )
}