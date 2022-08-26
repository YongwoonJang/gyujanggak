const { initializeApp } = require("firebase/app");
const { getDatabase, ref, update } = require("firebase/database");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const nodemailer = require('nodemailer');

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    databaseUrl: process.env.DATABASE_URL

}

const identification = {
    user: process.env.USER_ID,
    code: process.env.CODE
}

async function sendMail(author, contents){
    
    //Test to mail 
    let testAccount = nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVER,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ID, 
            pass: process.env.MAIL_KEY,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Gyujanggak" <'+process.env.MAIL_ID+'>', // sender address
        to: process.env.USER_ID, // list of receivers
        subject: author + "wrote in work experience", // Subject line
        text: "", // plain text body
        html: contents, // html body
    });

    console.log("Message sent: %s", info.messageId);

}

module.exports = async (req, res) => {

    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    let author = fullURL.searchParams.get('author');
    let contents = fullURL.searchParams.get('contents');

    sendMail(author, contents);

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);

    const curr = new Date();
    const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

    let today = new Date(utc + KR_TIME_DIFF);
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + "시 " + today.getMinutes() + "분";
    let dateTime = date + ' ' + time;

    let newId = utc + KR_TIME_DIFF;
    const commentData = {};
    commentData.Author = author;
    commentData.Content = contents;
    commentData.Date = dateTime;
    commentData.docId = newId;

    const updates = {};
    updates["/" + newId] = commentData;

    const gyujanggakRef = ref(db, 'questions/');

    console.log("20220826 debug");
    console.log(identification["user"]);

    signInWithEmailAndPassword(auth, identification["user"], identification["code"])
        .then(() => {
            update(gyujanggakRef, updates).then(() => {
                console.log("Document written with ID: ", newId);
                res.end();

            })
                .catch((error) => {
                    console.log("Error is : " + error);
                    res.end();

                })
        })
        .catch((error) => {
            console.log("Error is : " + error);

        });

};