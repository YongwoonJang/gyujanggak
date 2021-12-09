const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

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
    user : process.env.USER_ID,
    code : process.env.CODE
}

module.exports = (req, res) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    signInWithEmailAndPassword(auth, identification["user"], identification["code"])
    .then((data)=>{
        const token = data.user.getIdToken();
        console.log("new sign in token");
        console.log(token);
        return token;
    })
    .then((token)=>{
        console.log("after token is resolved");
        res.json(token);
    })
    .catch((error)=>{
        console.log(error);
        if(error.code != null){
            console.log(error.code);
            console.log(error.message);
        }
    });

}