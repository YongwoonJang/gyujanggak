import { useEffect } from "react";
import { useRouter } from "next/router";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


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
            console.log(event);
            console.log(id);
            console.log(pw);

            signInWithEmailAndPassword(auth, id, pw)
                .then((userCredential) => {
                    user = userCredential.user;
                    console.log(user);
                    router.push({
                        pathname: '/editor/profile', 
                        query: {user:user.email, userToken:user.accessToken}
                    });

                })
                .catch((error) => {
                    console.log("failed authentication");
                    console.log(error.code);
                    console.log(error.message);
                });

        });
    },[]);

    return(
        <>
            <div>
                <input id="id" />
                <input id="pw" />
                <button id="send">인증하기</button>
            </div>
        </>
    )
}