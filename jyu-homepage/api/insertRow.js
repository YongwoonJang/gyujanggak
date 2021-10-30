const { initializeApp } = require("firebase/app");
const { getFirestore, collection, setDoc, doc } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,

}

module.exports = async (req) => {

    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    author = fullURL.searchParams.get('author');
    contents = fullURL.searchParams.get('contents');

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + "시 " + today.getMinutes() + "분";
    let dateTime = date + ' ' + time;

    let globalTime = today.getFullYear().toString()
        + (today.getMonth() + 1).toString()
        + today.getDate().toString()
        + today.getHours().toString()
        + today.getMinutes().toString();
    + today.getSeconds();
    let newId = globalTime + doc(collection(db, "gyujanggak")).id;

    try {
        await setDoc(doc(db, "gyujanggak", newId), {
            "Author": author,
            "Content": contents,
            "Date": dateTime,
        });
        console.log("Document written with ID: ", newId);

    } catch (e) {
        console.error("Error adding document: ", e);

    }

};