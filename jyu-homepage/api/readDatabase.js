const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,

}

module.exports = async (req, res) => {
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    let data = [];

    const gyujanggakRef = collection(db, 'gyujanggak');
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