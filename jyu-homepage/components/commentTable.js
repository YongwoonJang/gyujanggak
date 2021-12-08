import React, { useState, useRef, useEffect } from 'react'

import parse from 'html-react-parser';
import pageStyles from '/styles/page.module.scss'

import { insertRow, deleteRow} from './databaseUtils'

//Apply realtime database.
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue } = require("firebase/database");
import {firebaseConfig} from './firebaseConfig';

const setTable = (localComments, setLines) => {
    if (localComments != null) {
        let rows = "";
        for (let i = (localComments.length - 1); i >= 0; i--) {
            rows = rows
                + "<tr>"
                + "<td>"
                + "<span>"
                + localComments[i].Author
                + "</span>"
                + "<br/>"
                + localComments[i].Date
                + "</td>"
                + "<td>"
                + localComments[i].Content
                + "</td>"
                + "<td style='display:none'>"
                + localComments[i].docId
                + "</td>"
                + "</tr>"
        }

        setLines(rows);
    }
}

export default function CommentTable(){

    //Variables for comments area
    const [lines, setLines] = useState("");

    //Variables for Dialogue area
    const [defaultContents, setContents] = useState("Hello world");
    const [defaultAuthor, setAuthor] = useState("JYU");

    // RefForCommentTable
    const commentTableRef = useRef(null);

    // RefForEditorArea
    const editCommentBoxRef = useRef(null);
    const editorBoxRef = useRef(null);
    const regButtonRef = useRef(null);
    const delButtonRef = useRef(null);

    // RefForDeleteItem
    const delDocIdRef = useRef(null);

    // Apply realtime Database 
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const gyujanggakRef = ref(db, 'chats/');
        
    let tempData = [];
    let data = [];

    //register change.
    useEffect(()=>{
        
        onValue(gyujanggakRef, (snapshot) => {
            tempData = snapshot.val();
            Object.keys(tempData).forEach(element => { data.push(tempData[element]) });

            if (data.length == 0) {
                data = [{ "Author": "Loading", "Date": "", "Content": "<span>Loading</span>", "docId": "Loading" }]
            }

            setTable(data, setLines);
            
        })
    })

    
    useEffect(() => {
        if (commentTableRef.current != null) {
            commentTableRef.current.querySelectorAll('tr').forEach(e => e.addEventListener("click", settingButton));
        }
        return function cleanup() {
            if (commentTableRef.current != null) {
                commentTableRef.current.querySelectorAll('tr').forEach(e => e.removeEventListener("click", settingButton));

            }
        };
    }, [lines]);

    const settingButton = (e) => {

        if (delDocIdRef.current.innerHTML == e.currentTarget.children[2].innerHTML) {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "black";
            regButtonRef.current.style.display = "block";
            delButtonRef.current.style.display = "none";
            delDocIdRef.current.innerHTML = "";

        } else if (delDocIdRef.current.innerHTML != e.currentTarget.children[2].innerHTML) {
            commentTableRef.current.querySelectorAll('tr').forEach(tr => { tr.style.backgroundColor = "white"; tr.style.color = "black" })
            e.currentTarget.style.backgroundColor = "rgb(166, 26, 26)";
            e.currentTarget.style.color = "white";
            regButtonRef.current.style.display = "none";
            delButtonRef.current.style.display = "block";
            delDocIdRef.current.innerHTML = e.currentTarget.children[2].innerHTML;

        }

        if (delDocIdRef.current.innerHTML != "") {
            editCommentBoxRef.current.children[0].value = e.currentTarget.children[1].innerHTML;
            editorBoxRef.current.children[0].value = e.currentTarget.children[0].children[0].innerHTML;

        } else {
            editCommentBoxRef.current.children[0].value = "";
            editorBoxRef.current.children[0].value = "";

        }
    };

    //button actions
    const handleContentsChange = event => {
        event.preventDefault();
        setContents(event.target.value);

    }

    const handleAuthorChange = event => {
        event.preventDefault();
        setAuthor(event.target.value);

    }

    const insertOrDelComment = event => {
        event.preventDefault();

        if (delDocIdRef.current.innerHTML != "") {
            console.log("commentTable line 144")
            deleteRow(delDocIdRef.current.innerHTML);
            console.log("commentTable line 146")
            alert("성공적으로 삭제되었습니다.");

        } else {
            insertRow(defaultAuthor, defaultContents);
            alert("성공적으로 저장되었습니다.");

        }

        //reset all of status about delete and write.
        commentTableRef.current.querySelectorAll('tr').forEach(tr => {
            tr.style.backgroundColor = "white";
            tr.style.color = "black";
            regButtonRef.current.style.display = "block";
            delButtonRef.current.style.display = "none";
        })

        delDocIdRef.current.innerHTML = "";
        editCommentBoxRef.current.children[0].value = "";
        editorBoxRef.current.children[0].value = "";


    }

    return(
        <>
            <div>
                <div className={pageStyles.communicationComments}>
                    Comments
                </div>
                <table ref={commentTableRef} className={pageStyles.communicationCommentsTable}>
                    <tbody>
                        {parse(lines)}
                    </tbody>
                </table>
            </div>
            <div className={pageStyles.communicationRegForm}>
                <form onSubmit={insertOrDelComment}>
                    <div className={pageStyles.communicationRegComment}>
                        <div ref={editCommentBoxRef} className={pageStyles.communicationRegCommentBox}>
                            <textarea id="comment" placeholder={defaultContents} onChange={handleContentsChange} />
                        </div>
                        <div ref={editorBoxRef} className={pageStyles.communicationAuthorBox}>
                            <input id="author" placeholder={defaultAuthor} onChange={handleAuthorChange} />
                        </div>
                        <div ref={regButtonRef} className={pageStyles.communicationRegButtonBox}>
                            <button type="submit">게시  하기</button>
                        </div>
                        <div ref={delButtonRef} className={pageStyles.communicationDelButtonBox}>
                            <button type="submit">삭제  하기</button>
                        </div>
                    </div>
                    <div ref={delDocIdRef} style={{ display: "none" }}></div>
                </form>
            </div>
        </>
    )


    

}