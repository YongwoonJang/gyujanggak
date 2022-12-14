
import { useEffect, useState } from "react";
import bookEditorStyle from '/styles/bookEditorStyle.module.scss';
import utf8 from "utf8";

export default function InputGroup(props) {

    useEffect(() => {
        if (props.value != null && props.value != undefined) {
            if (props.label === "review") {
                try {
                    props.setValue(props.label, utf8.decode(props.value));
                } catch (e) {
                    console.log(e);
                    props.setValue(props.label, props.value);
                }

            } else {
                props.setValue(props.label, props.value);
            }

        }
    })

    const onHandletextareaKeyUp = (e) => {
        if (e.ctrlKey && e.key === "s") {
            props.submit();
        }
    }

    const onHandletextareaKeydown = (e) => {
        let el = e.target;
        setTimeout(() => {
            el.style.cssText = "height:auto;";
            el.style.cssText = "height:" + el.scrollHeight + "px;";
        }, 0);
    }

    const onHandlePreviewChange = (e) => {
        if (e.target.name == "image") {
            const el = document.getElementById("preview");
            el.src = URL.createObjectURL(e.target.files[0]);
            props.setValue("image", e.target.files[0]);

        }
    }

    return (
        <div className={bookEditorStyle.row}>
            <div className={bookEditorStyle.col25}>
                <label for={props.label}>{props.label}</label>
            </div>
            <div className={bookEditorStyle.col75}>
                {props.isTextarea ?
                    (<textarea
                        onKeyUp={onHandletextareaKeyUp}
                        id={props.label}
                        type="text"
                        placeholder={props.placeholder}
                        {...props.register}
                        onKeyDown={onHandletextareaKeydown}
                    />) :
                    (<input
                        id={props.label}
                        type={props.label != "image" ? "text" : "file"}
                        placeholder={props.placeholder}
                        {...props.register}
                        onChange={onHandlePreviewChange}
                    />)}
                {!props.isTextarea && props.label == "image" && props.value != "" && <img id="preview" src={props.value} />}
            </div>
            <div>
                {props.errors && <p className={bookEditorStyle.errorMsg}> {props.errors.message}</p>}
            </div>
        </div>
    )
}

export function HistoryInputGroup(props) {

    const [loanHistory, setLoanHistory] = useState(null);
    const [newLoanHistory, setNewLoanHistory] = useState(null);
    const [isDelete, setIsDelete] = useState(false);
    const [deleteItemIndex, setDeleteItemIndex] = useState(-1);

    const setDeleteItem = (index) => {
        setDeleteItemIndex(index);
        setIsDelete(!isDelete);

    }

    const setTable = (elements) => {
        let tempTable = [];
        if (elements != undefined) {
            elements.forEach((history) => {
                tempTable.push(
                    <>
                        <div className={(isDelete && (deleteItemIndex == elements.indexOf(history))) ? `${bookEditorStyle.row}  ${bookEditorStyle.select}` : `${bookEditorStyle.row}`} onClick={() => { setDeleteItem(elements.indexOf(history)); }}>
                            <div className={bookEditorStyle.col33}>{history.loanDate}</div>
                            <div className={bookEditorStyle.col33}>{history.returnDate === "null" ? "대출 중" : history.returnDate}</div>
                            <div className={bookEditorStyle.col33}>{history.borrower}</div>
                        </div>
                    </>
                );
            })
        }

        return tempTable
    }

    const onSubmit = (e) => {
        e.preventDefault();

        let newHistoryList = [];
        if (!isDelete) {
            newHistoryList = newLoanHistory.slice();
            newHistoryList.push(
                {
                    "loanDate": document.getElementsByName("loanDate")[0].value,
                    "returnDate": document.getElementsByName("returnDate")[0].value,
                    "borrower": document.getElementsByName("borrower")[0].value
                }
            );

            setNewLoanHistory(newHistoryList);
            props.setValue("list", newHistoryList);

            //reset
            document.getElementsByName("loanDate")[0].value = "";
            document.getElementsByName("returnDate")[0].value = "";
            document.getElementsByName("borrower")[0].value = "";
        } else {
            newHistoryList = newLoanHistory.slice();
            newHistoryList.splice(deleteItemIndex, 1);
            setNewLoanHistory(newHistoryList);
            props.setValue("list", newHistoryList);
            setIsDelete(!isDelete);

        }


    }

    useEffect(() => {
        if (loanHistory === null) {

            setLoanHistory(props.value);
            setNewLoanHistory(props.value);
            props.setValue("list", props.value);

        } else {
            if (loanHistory != props.value) {//if page is turned.
                setIsDelete(false);
                setDeleteItemIndex(null);
                setLoanHistory(props.value);
                setNewLoanHistory(props.value);
                props.setValue("list", props.value);

            } else {
                props.setValue("list", newLoanHistory);

            }
        }
    })

    return (
        <div className={`${bookEditorStyle.row}`} >

            <div className={bookEditorStyle.row}>
                <div>
                    <label htmlFor={props.label}>{props.label}</label>
                </div>
            </div>
            <div className={`${bookEditorStyle.row} ${bookEditorStyle.historyInputGroupContainer}`}>
                <div className={bookEditorStyle.col25}>
                    <input
                        type="submit"
                        value={!isDelete ? "추가" : "삭제"}
                        onClick={onSubmit}
                    />
                </div>
                <div className={bookEditorStyle.col75}>
                    <div className={bookEditorStyle.row}>
                        <div className={bookEditorStyle.col33}>대출일</div>
                        <div className={bookEditorStyle.col33}>반납일</div>
                        <div className={bookEditorStyle.col33}>빌린사람</div>
                    </div>
                    <div className={bookEditorStyle.row}>
                        <input
                            className={bookEditorStyle.col33}
                            name="loanDate"
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                        />
                        <input
                            className={bookEditorStyle.col33}
                            name="returnDate"
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                        />
                        <input
                            className={bookEditorStyle.col33}
                            name="borrower"

                        />
                    </div>
                    {setTable(newLoanHistory)}
                </div>
            </div>

        </div>
    )
}