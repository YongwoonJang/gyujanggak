const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue } = require("firebase/database");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const { getAuth, signInWithEmailAndPassword, signOut } = require("firebase/auth");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    databaseURL: process.env.DATABASE_URL
}

const identification = {
    "user": process.env.USER_ID,
    "code": process.env.CODE
}


module.exports = async (req, res) => {
    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    let name = fullURL.searchParams.get('name');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    let data = [];
    
    await signInWithEmailAndPassword(auth, identification["user"], identification["code"]);
    const db = getFirestore(app);
    const gyujanggakRef = collection(db, name);
    const gyujanggakSnapshot = await getDocs(gyujanggakRef);

    gyujanggakSnapshot.forEach((doc) => {
        let tempObject = doc.data();
        tempObject["docId"] = doc.id;
        data.push(tempObject);

    });

    res.json({
        data: data
    });

};