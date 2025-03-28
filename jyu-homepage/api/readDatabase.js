const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    
}


module.exports = async (req, res) => {
    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    let name = fullURL.searchParams.get('name');
    let data = [];

    const app = initializeApp(firebaseConfig);
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