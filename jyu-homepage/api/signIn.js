const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

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
    user: process.env.USER_ID,
    code: process.env.CODE
}

module.exports = async (req, res) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    console.log("this section is executed");

    await signInWithEmailAndPassword(auth, identification["user"], identification["code"])
    .then((userCredential) => {
        console.log("login is complete");

    })
    .catch((error) => {
        console.log(error.code);
        console.log(error.log);
        console.log("login is failed");

    })
    .finally(() => {
        console.log("finally section is executed");
        res.setHeader("Access-Control-Allow-origin", "*");
        res.end();

    })
    
}