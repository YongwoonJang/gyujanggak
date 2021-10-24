const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,

}

module.exports = (req, res) => {
    
    initializeApp(firebaseConfig);
    const db = getFirestore();
    let data = [];

    console.log(db);
    // const gyujanggakRef = db.collection('gyujanggak');
    console.log(gyujanggakRef);
    console.log("this section is executed");
    // const querySnapshot = await gyujanggakRef.get();
    // querySnapshot.forEach((doc) => {
    //     let tempObject = doc.data();   
    //     tempObject["docId"] = doc.id;
    //     data.push(tempObject);

    // });

    res.json({
        //body: req.body,
        body: data,
        query: req.query,
        cookies: req.cookies,
    });
};