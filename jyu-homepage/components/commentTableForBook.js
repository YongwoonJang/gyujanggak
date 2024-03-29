//For utilities
import { useState, useEffect } from 'react'

//For styling 
import pageStyles from '/styles/page.module.scss'

//Apply firestore database
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { identification } from '../components/firebaseConfig';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";



export default function CommentTableForBook(props){

    //Variables for comments area
    const [lines, setLines] = useState("");
    const [commentId, setCommentId] = useState(0);
    const [isTextAreaEmpty, setIsTextAreaEmpty] = useState(true);

    // Apply firestore
    const firebaseConfig = {
        apiKey: "AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0",
        authDomain: "gyujanggak-99e8a.firebaseapp.com",
        projectId: "gyujanggak-99e8a"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleCommentClick = async (localId) => {
        
        const commentElements = document.querySelectorAll("[id^='comment-']");
        commentElements.forEach((element) => {
            if (element.id !== localId) {
                element.style.backgroundColor = "white";
            }
        });
        if(document.getElementById(localId).style.backgroundColor == "lightgray"){
            document.getElementById(localId).style.backgroundColor = "white";
            setCommentId(0);

        }else{
            document.getElementById(localId).style.backgroundColor = "lightgray";
            setCommentId(localId);

        }
    
    };

    const handleDeleteComment = async () => {
        const db = getFirestore(app);
        const docRef = doc(db, "bookList", props.id);
        const docSnap = await getDoc(docRef);
        const comments = docSnap.data().comment;
        comments.splice(commentId, 1);
        await setDoc(docRef, { comment: comments }, { merge: true });
        setCommentId(0);
    };
    
    const setTable = (localComments) => {
        if (localComments.length > 0) {
            let rows = [];
            for (let i = (localComments.length - 1); i >= 0; i--) {
                rows.push(
                    <tr onClick={() => handleCommentClick(`comment-${i}`)}>
                        <td id={`comment-${i}`}>
                            {Object.values(localComments[i])}
                        </td>
                    </tr>                
                )
            }
            setLines(rows);
        }
    }

    useEffect(async () => {
        
        const db = getFirestore(app);
        const docRef = doc(db, "bookList", props.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.data().comment === undefined) {
            const comments = [];
            const currentTime = Date.now();    
            comments.push({[currentTime] : "Hello world"});
            await setDoc(docRef, {comment: comments}, { merge: true });
        
        } 

        onSnapshot(docRef, (doc) => {
            const data = doc.data();
            setTable(data.comment);

        });    

    },[])//end of useEffect

    useEffect(() => {
        const textArea = document.getElementById("comment");
        textArea.addEventListener("input", handleTextAreaChange);
        return () => {
            textArea.removeEventListener("input", handleTextAreaChange);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentUser = auth.currentUser;
        if (currentUser) {
            console.log("User already signed in:", currentUser);

        } else {
            await signInWithEmailAndPassword(auth, identification['user'], identification['code'])
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log("User signed in:", user);
                })
                .catch((error) => {
                    // Handle errors
                    console.error("Error signing in:", error);
                });
        }

        if(isTextAreaEmpty != true){
            const db = getFirestore(app);
            const docRef = doc(db, "bookList", props.id);
            const docSnap = await getDoc(docRef);
            const comments = docSnap.data().comment;
            const currentTime = Date.now();
            comments.push({[currentTime] : document.getElementById("comment").value});
            await setDoc(docRef, {comment: comments}, { merge: true });
            document.getElementById("comment").value = "";
            setIsTextAreaEmpty(true);
        
        };

    }

    const handleTextAreaChange = () => {
        const isEmpty = document.getElementById("comment").value === "";
        // Perform actions based on whether the text area is empty or not
        if (isEmpty) {
            setIsTextAreaEmpty(true);

        } else {
            setIsTextAreaEmpty(false);
            
        }
    };

    return(
        <>
            <div>
                Comment
            </div>
            <div className={pageStyles.commentGroup}>
                <table className={pageStyles.communicationCommentsTable}>
                    <tbody>
                        {lines}
                    </tbody>
                </table>
                {
                commentId!=0 ? 
                <button className={pageStyles.communicationDelButtonBox} onClick={() => handleDeleteComment()}>Delete</button> 
                : 
                    <form onSubmit={handleSubmit}>
                        <textarea placeholder={"add a comment..."}className={pageStyles.communicationRegCommentBox} id="comment"/>
                        {isTextAreaEmpty != true? (
                            <button className={pageStyles.communicationRegButtonBox} type="submit">
                                Send
                            </button>
                        ) : (
                            <></>
                        )}
                    </form>
                  
                }
            </div>
        </>
    )
}