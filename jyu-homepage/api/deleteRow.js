const { initializeApp } = require("firebase/app");
const { getFirestore, deleteDoc, doc } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,

}

module.exports = async (req, res) => {
    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    localDelDocId = fullURL.searchParams.get('localDelDocId');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    if (localDelDocId != null) {
        try {
            await deleteDoc(doc(db, "gyujanggak", localDelDocId));
            console.log("Document delete with ID: ", localDelDocId);

        } catch (e) {
            console.error("Error removing document: ", e);

        }
    }

    res.end();

};