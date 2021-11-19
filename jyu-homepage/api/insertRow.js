const { initializeApp } = require("firebase/app");
const { getDatabase, ref, update } = require("firebase/database");
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
    author = fullURL.searchParams.get('author');
    contents = fullURL.searchParams.get('contents');
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, identification["user"], identification["code"]);

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + "시 " + today.getMinutes() + "분";
    let dateTime = date + ' ' + time;

    let newId = today.getTime();

    try {
        const commentData = {};
        commentData.Author = author;
        commentData.Content = contents;
        commentData.Date = dateTime;
        commentData.docId = newId;

        const updates = {};
        updates["/" + newId] = commentData;

        const gyujanggakRef = ref(db, 'chats/');
        update(gyujanggakRef, updates);

        console.log("Document written with ID: ", newId);

    } catch (e) {
        console.error("Error adding document: ", e);

    }
    signOut(auth);

    res.end();

};