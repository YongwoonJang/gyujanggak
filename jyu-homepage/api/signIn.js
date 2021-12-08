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

    console.log("Sign In module is executed");

    await signInWithEmailAndPassword(auth, identification["user"], identification["code"])
    .then((userCredential) => {
        console.log("signInWithEmailAndPassword function is executed");
        console.log("current user is below");
        console.log(auth.currentUser);
        res.setHeader("Access-Control-Allow-origin", "*");
        res.end();
    })
    .catch((error) => {
        console.log("SignInWithEmailAndPassword function is failed with below error")
        console.log(error);
        if(error.code != null){
            console.log(error.code);
            console.log(error.log);
        }
        res.setHeader("Access-Control-Allow-origin", "*");
        res.end();

    })
    
}