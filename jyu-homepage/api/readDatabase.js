const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    // messagingSenderId: process.env.MESSAGING_SENDER_ID,
    // appId: process.env.API_ID,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    // storageBucket: process.env.STORAGE_BUCKET,
    // databaseURL: process.env.DATABASE_URL
}


module.exports = async (req, res) => {
    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    let name = fullURL.searchParams.get('name');
    console.log(name);
    
    let data = [];

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const gyujanggakRef = collection(db, name);
    const gyujanggakSnapshot = await getDocs(gyujanggakRef);

    console.log(gyujanggakSnapshot);

    gyujanggakSnapshot.forEach((doc) => {
        let tempObject = doc.data();
        tempObject["docId"] = doc.id;
        data.push(tempObject);

    });

    res.json({
        data: data
    });

};