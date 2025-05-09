import { initializeApp } from "firebase/app";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { createHash } from "crypto";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID

}

module.exports = async (req, res) => {

    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    let user = fullURL.searchParams.get('user');
    let title = fullURL.searchParams.get('title');
    let contents_title = fullURL.searchParams.get('contents_title');
    let contents = fullURL.searchParams.get('contents');
    let image = fullURL.searchParams.get('image');
    
    let userHash = createHash('sha256').update(process.env.USER_UID).digest('hex');

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    if(user == userHash){
        signInWithEmailAndPassword(auth, process.env.USER_ID, process.env.CODE)
        .then(()=>{
            if (contents != null) {
                
                try{
                    setDoc(doc(db, title, process.env.USER_ID), {
                        title: contents_title,
                        contents: contents,
                        image: image
                    }).then(()=>{
                        res.end();
                    });

                }catch(e){
                    console.log(e);
                    res.end();

                }
            }

        })
        .catch((error)=>{
            console.log("authentication failed");
            console.log(error.code);
            console.log(error.message);
            res.end();

        });
    }

}