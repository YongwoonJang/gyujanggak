const { initializeApp } = require("firebase/app");
const { getDatabase, ref, remove } = require("firebase/database");
const { getAuth, signInWithEmailAndPassword, signOut } = require("firebase/auth");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    databaseUrl: process.env.DATABASE_URL,

}

const identification = {
    "user": process.env.USER_ID,
    "code": process.env.CODE
}

module.exports = async (req, res) => {
    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    localDelDocId = fullURL.searchParams.get('localDelDocId');
    
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth(app);
    
    console.log("signInWithEmailAndPassword session");
    await signInWithEmailAndPassword(auth, identification["user"], identification["code"])
    .then((userCredential) => {
        
        if (localDelDocId != null) {
            const gyujanggakRef = ref(db, 'chats/' + localDelDocId);
            remove(gyujanggakRef).then(()=>{
                console.log("Document delete with ID: ", localDelDocId);
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error code is : " + errorCode);
                console.log("Error message is : " + errorMessage);
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end();
            })
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error code is : " + errorCode);
        console.log("Error message is : " + errorMessage);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end();
    });
};