const { initializeApp, getApp } = require("firebase/app");
const { getDatabase, ref, update } = require("firebase/database");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const sendMail = require('../components/sendMail');

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    databaseUrl: process.env.DATABASE_URL

}

const identification = {
    user: process.env.USER_ID,
    code: process.env.CODE
}

module.exports = async (req, res) => {

    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    author = fullURL.searchParams.get('author');
    contents = fullURL.searchParams.get('contents');
   
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);
    
    console.log("check before auth status");
    console.log(auth.currentUser);

    const curr = new Date();
    const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

    let today = new Date(utc + KR_TIME_DIFF);
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + "시 " + today.getMinutes() + "분";
    let dateTime = date + ' ' + time;

    let newId = utc + KR_TIME_DIFF;
    const commentData = {};
    commentData.Author = author;
    commentData.Content = contents;
    commentData.Date = dateTime;
    commentData.docId = newId;

    const updates = {};
    updates["/" + newId] = commentData;

    const gyujanggakRef = ref(db, 'chats/');

    console.log("20220818");
    console.log(identification["user"]);
    console.log(identification["code"]);

    signInWithEmailAndPassword(auth, identification["user"], identification["code"])
    .then(()=>{
        update(gyujanggakRef, updates).then(async () => {
            console.log("Document written with ID: ", newId);
            await sendMail(process.env.MAIL_SERVER,
                process.env.MAIL_ID,
                process.env.USER_ID,
                process.env.MAIL_KEY,
                process.env.MAIL_ADDR,
                "GYUJANGGAK main comments page",
                author,
                contents);
            res.end();

        })
        .catch((error) => {
            console.log("Error is : " + error);
            console.log("Error code is : " + error.code);
            console.log("Error message is : " + error.message);
            res.end();

        })
    })
    .catch((error)=>{
        console.log("Error is : "+error);
        console.log("Error code is : "+error.code);
        console.log("Error message is : "+error.message);

    });

};