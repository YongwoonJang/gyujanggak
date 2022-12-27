"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DataConverter;
exports.identification = void 0;
require("core-js/modules/es.promise.js");
require("core-js/modules/es.object.assign.js");
var _app = require("firebase/app");
var _firestore = require("firebase/firestore");
var _auth = require("firebase/auth");
const firebaseConfig = {
  apiKey: "AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0",
  authDomain: "gyujanggak-99e8a.firebaseapp.com",
  databaseURL: "https://gyujanggak-99e8a-default-rtdb.firebaseio.com",
  projectId: "gyujanggak-99e8a",
  storageBucket: "gyujanggak-99e8a.appspot.com",
  messagingSenderId: "442347175475",
  appId: "1:442347175475:web:ea5374ac2d0c8458972d46"
};
const identification = {
  user: "royalfamily89@gmail.com",
  code: "202112121241KOREAghgAgn:&FgAUSTU"
};
exports.identification = identification;
function DataConverter() {
  (0, _app.initializeApp)(firebaseConfig);
  const db = (0, _firestore.getFirestore)();
  const auth = (0, _auth.getAuth)();
  (0, _auth.signInWithEmailAndPassword)(auth, "jyy3k@naver.com", "new1234!").then(async () => {
    const docSnap = await (0, _firestore.getDoc)((0, _firestore.doc)(db, "info", "titleList"));
    const titleList = docSnap.data().title;
    for (let i = 0; i < titleList.length; i++) {
      const contentSnap = await (0, _firestore.getDoc)((0, _firestore.doc)(db, titleList[i], "contents"));
      const contents = contentSnap.data();
      let isbn = contents["isbn"];
      delete contents["isbn"];
      const loanHistorySnap = await (0, _firestore.getDoc)((0, _firestore.doc)(db, titleList[i], "loanHistory"));
      const loanHistory = loanHistorySnap.data().list;
      Object.assign(contents, {
        "loanHistory": loanHistory
      });
      await (0, _firestore.setDoc)((0, _firestore.doc)(db, "bookList", isbn), contents);
    }
  }).catch(e => {
    console.log(e);
  });
  console.log("done!");
  return 0;
}
DataConverter();