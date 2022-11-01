import { useEffect } from "react";
import { useRouter } from "next/router";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import mgmtStyle from '/styles/mgmtStyle.module.scss';


const firebaseConfig = {
    apiKey: "AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0",
    authDomain: "gyujanggak-99e8a.firebaseapp.com",
    databaseURL: "https://gyujanggak-99e8a-default-rtdb.firebaseio.com",
    projectId: "gyujanggak-99e8a",
    storageBucket: "gyujanggak-99e8a.appspot.com",
    messagingSenderId: "442347175475",
    appId: "1:442347175475:web:ea5374ac2d0c8458972d46"
};

export default function Login() {
    const router = useRouter();
    
    useEffect(()=>{
        const btn = document.getElementById("send"); 
        let user = null;

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        btn.addEventListener("click",(event)=>{

            let id = document.getElementById("id").value;
            let pw = document.getElementById("pw").value;

            signInWithEmailAndPassword(auth, id, pw)
                .then((userCredential) => {
                    user = userCredential.user;
                    router.push({
                        pathname: '/editor/profile', 
                        query: {user:user.email}
                    });

                })
                .catch((error) => {
                    console.log("authentication failed");
                    console.log(error.code);
                    console.log(error.message);
                });

        });
    },[]);

    return(
        <>
            <div className={mgmtStyle.loginForm}>
                <div className={mgmtStyle.loginTitle}>
                    <label> Management </label>
                </div>
                <div className={mgmtStyle.loginInput}>
                    <input id="id" />
                    <input id="pw" type="password" />
                </div>
                <div className={mgmtStyle.loginBtn}>
                    <button id="send">Connect</button>
                </div>
            </div>
        </>
    )
}