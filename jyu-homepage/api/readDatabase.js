const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

module.exports = (req, res) => {
    
    initializeApp();
    const db = getFirestore();
    let data = [];

    const gyujanggakRef = db.collection('gyujanggak');
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