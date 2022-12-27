import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, getDoc, collection, doc, setDoc } from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0",
    authDomain: "gyujanggak-99e8a.firebaseapp.com",
    databaseURL: "https://gyujanggak-99e8a-default-rtdb.firebaseio.com",
    projectId: "gyujanggak-99e8a",
    storageBucket: "gyujanggak-99e8a.appspot.com",
    messagingSenderId: "442347175475",
    appId: "1:442347175475:web:ea5374ac2d0c8458972d46"
};

export const identification = {
    user: "royalfamily89@gmail.com",
    code: "202112121241KOREAghgAgn:&FgAUSTU"
};

export default function DataConverter(){
    initializeApp(firebaseConfig);
    const db = getFirestore();
    const auth = getAuth();
    
    signInWithEmailAndPassword(auth, "jyy3k@naver.com", "new1234!")
    .then(async ()=>{
        const docSnap = await getDoc(doc(db, "info", "titleList"));
        const titleList = docSnap.data().title;
        
        for(let i = 0; i < titleList.length; i++){
            const contentSnap = await getDoc(doc(db,titleList[i],"contents"));
            const contents = contentSnap.data();
            
            let isbn = contents["isbn"];
            delete contents["isbn"];

            const loanHistorySnap = await getDoc(doc(db,titleList[i],"loanHistory"));
            const loanHistory = loanHistorySnap.data().list;

            Object.assign(contents, { "loanHistory": loanHistory })

            await setDoc(doc(db, "bookList", isbn), contents);

        }


    })
    .catch((e)=>{
        console.log(e);
    })

    console.log("done!");
    return 0;
}

DataConverter();