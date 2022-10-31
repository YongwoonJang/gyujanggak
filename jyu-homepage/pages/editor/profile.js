import { initializeApp } from "firebase/app";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { useEffect } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0",
    authDomain: "gyujanggak-99e8a.firebaseapp.com",
    databaseURL: "https://gyujanggak-99e8a-default-rtdb.firebaseio.com",
    projectId: "gyujanggak-99e8a",
    storageBucket: "gyujanggak-99e8a.appspot.com",
    messagingSenderId: "442347175475",
    appId: "1:442347175475:web:ea5374ac2d0c8458972d46"
};

export default function Profile(){

    //useEffect
    useEffect(() => {

        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                console.log("signed in");
                const uid = user.uid;

                


            } else {
                // User is signed out
                console.log("signed out");
            }
        },[]);
        
        // const btn = document.getElementById("post");

        // btn.addEventListener("click", (event) => {
        //     const app = initializeApp(firebaseConfig);
        //     const db = getFirestore(app);

        //     let title = document.getElementById("title");
        //     let contents = document.getElementById("contents");
        //     let dateLoaned = document.getElementById("dateLoaned");
        //     let nameOfBorrower = document.getElementById("nameOfBorrower");

        //     const curr = new Date();
        //     const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        //     const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        //     const newId = utc + KR_TIME_DIFF;

        //     setDoc(doc(db, title, newId), {
        //         contents: contents,
        //         dateLoaned: dateLoaned,
        //         nameOfBorrower: nameOfBorrower

        //     })}
        // )
    })

    const router = useRouter();
    const user = router.query.user;

    const app = initializeApp(firebaseConfig);

    //monitoring state
    

    if (!user || user.isLoggedIn == false) {
        //redirect to login page.
        return <div>Loading....</div>

    }

    //else print user information
    return(
        <>
            <div id="main">
            <h1>Hello Editor Yongun</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
        </>
    )
}