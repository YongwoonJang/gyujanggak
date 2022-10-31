import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { createHash } from 'crypto';

const baseURL = "https://gyujanggak.vercel.app/api";
//const baseURL = "http://localhost:80" for test

export default function Profile(){
    const router = useRouter();
    const user = router.query.user;

    //useEffect
    useEffect(() => {
        if (!(!user || user.isLoggedIn == false)) {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in
                    console.log("signed in");
                    const btn = document.getElementById("post");
                    let title = document.getElementById("title").value;
                    let contents = document.getElementById("contents").value;
                    let userHash = createHash('sha256').update(user.uid).digest('hex');

                    btn.addEventListener("click", async (event) => {
                        const destination = baseURL + '/addBook';
                        let url = new URL(destination);

                        let params = { 'user': userHash,  'title': title, 'contents': contents};
                        url.search = new URLSearchParams(params).toString();

                        const querySnapshot = await fetch(url);
                        const result = await querySnapshot.json();
                        
                    });
                    
                } 
            })
        }
    });

    //monitoring state
    if (!user || user.isLoggedIn == false) {
        //redirect to login page.
        return (
            <>
                <div>
                    <a href="https://gyujanggak.vercel.app/auth/login">Need to log in</a>
                </div >    
            </>
        )

    }

    //else print user information
    return(
        <>
            <div id="main">
                <h1>Hello: Editor Yongun</h1>
                <pre>{JSON.stringify(user, null, 2)}</pre>
                
                    <label>title</label>
                    <input id="title"></input>
                    
                    <label>contents</label>
                    <textarea id="contents"></textarea>
                    
                    <button id="post">Post</button>
            </div>
        </>
    )
}