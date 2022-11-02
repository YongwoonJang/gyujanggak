
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef } from "react";
import { createHash } from 'crypto';
import mgmtStyle from '/styles/mgmtStyle.module.scss';

const baseURL = "https://gyujanggak.vercel.app/api";
// const baseURL = "http://localhost:80" 

export default function Profile(){
    const router = useRouter();
    const user = router.query.user;

    const loginSuccess = useRef(null);
    const defaultPage = useRef(null);

    
    //useEffect
    useEffect(() => {
        loginSuccess.current.style.display = "none";
        if (!(!user || user.isLoggedIn == false)) {
            
            try{
                const auth = getAuth();
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        // User is signed in
                        loginSuccess.current.style.display = "block";
                        defaultPage.current.style.display = "none";

                        const btn = document.getElementById("post");
                        
                        btn.addEventListener("click", async (event) => {
                            const destination = baseURL + '/addBook';
                            let url = new URL(destination);
                            let title = document.getElementById("title").value;
                            let contents = document.getElementById("contents").value;
                            let userHash = createHash('sha256').update(user.uid).digest('hex');

                            let params = { 'user': userHash,  'title': title, 'contents': contents};
                            url.search = new URLSearchParams(params).toString();

                            const querySnapshot = await fetch(url);
                            const result = await querySnapshot.json();
                            
                        });
                    } 
                })
                
            } catch (e) { 
                console.log("Error is " + e);
                console.log("Not permitted access");
                    
            }
            return;
        }

        router.push({
            pathname: '/auth/login'

        });

    },[]);

    //else print user information
    return(
        <>
            <div>
                <div ref={defaultPage}>
                    <a href="https://gyujanggak.vercel.app/auth/login">Need to log in</a>
                </div >

                <div ref={loginSuccess} className={mgmtStyle.main}>
                    <div className={mgmtStyle.mainTitle}>
                        <h1>Hello: Editor Yongun</h1>
                    </div>
                    <div>
                        <label>title</label>
                        <input id="title"></input>
                    </div>
                    <div>
                        <label>contents</label>
                        <textarea id="contents"></textarea>
                    </div>
                    <div>
                        <button id="post">Post</button>
                    </div>
                </div>
            </div>
        </>
    )
}