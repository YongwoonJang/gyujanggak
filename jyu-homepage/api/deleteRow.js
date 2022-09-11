const { initializeApp } = require("firebase/app");
const { getDatabase, ref, remove } = require("firebase/database");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const sendMail = require('../components/sendMail');

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
    user: process.env.USER_ID,
    code: process.env.CODE
}

module.exports = async (req, res) => {
    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    let author = fullURL.searchParams.get('author');
    let contents = fullURL.searchParams.get('contents');
    localDelDocId = fullURL.searchParams.get('localDelDocId');
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);

    signInWithEmailAndPassword(auth, identification["user"], identification["code"])
    .then(() => {
        if (localDelDocId != null) {
            const gyujanggakRef = ref(db, 'chats/' + localDelDocId);
            remove(gyujanggakRef).then(async ()=>{
                console.log("Document delete with ID: ", localDelDocId);
                await sendMail(process.env.MAIL_SERVER,
                    process.env.MAIL_ID,
                    process.env.USER_ID,
                    process.env.MAIL_KEY,
                    process.env.MAIL_ADDR,
                    "GYUJANGGAK main comments page(comment delete)",
                    author,
                    contents);
                res.end();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error code is : " + errorCode);
                console.log("Error message is : " + errorMessage);
                res.end();
            })
        }
    })
    .catch((error) => {
        console.log("Error is : " + error);
        console.log("Error code is : " + error.code);
        console.log("Error message is : " + error.message);

    });

};