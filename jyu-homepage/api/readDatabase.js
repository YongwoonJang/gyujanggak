const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue } = require("firebase/database");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    databaseURL: process.env.DATABASE_URL
}

module.exports = async (req, res) => {
    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    let name = fullURL.searchParams.get('name');
    const app = initializeApp(firebaseConfig);
    
    let data = [];

    if (name == "gyujanggak") {
        const db = getDatabase(app);
        const gyujanggakRef = ref(db, 'chats/');
        let tempData = [];

        onValue(gyujanggakRef, (snapshot) => {
            data = snapshot.val();
        })

        Object.keys(tempData).forEach(element => { data.push(tempData[element]) });

        if(data.length == 0){
            data = [{ "Author": "Loading", "Date": "", "Content": "<span>Loading</span>", "docId": "Loading" }]
        }

        console.log(data);


    } else {
        const db = getFirestore(app);
        const gyujanggakRef = collection(db, name);
        const gyujanggakSnapshot = await getDocs(gyujanggakRef);

        gyujanggakSnapshot.forEach((doc) => {
            let tempObject = doc.data();
            tempObject["docId"] = doc.id;
            data.push(tempObject);

        });

    }

    res.json({
        data: data
    });

};