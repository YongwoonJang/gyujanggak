import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { identification } from './firebaseConfig';

//const baseURL = "http://localhost:80";
const baseURL = "https://gyujanggak.vercel.app/api";

export async function readDatabase(name) {
    const destination = baseURL + '/readDatabase';
    let url = new URL(destination)

    let params = { 'name': name };
    url.search = new URLSearchParams(params).toString();

    const querySnapshot = await fetch(url);
    const result = await querySnapshot.json();
    return result['data'];

}

//Insert to database and update comments array.
export function insertRow(author, contents) {
    let destination = baseURL + '/insertRow';
    let url = new URL(destination);

    let params = { 'author': author, 'contents': contents };
    url.search = new URLSearchParams(params).toString();

    fetch(url);
}

//Delete from database and update comments array
export function deleteRow(localDelDocId) {
    let destination = baseURL + '/deleteRow';
    var url = new URL(destination)

    var params = { 'localDelDocId': localDelDocId };
    url.search = new URLSearchParams(params).toString();
    fetch(url);
    
}

export async function signIn(app){

    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, identification["user"], identification["code"])
    .then((userCredential)=>{
        console.log("login success");
    })
    .catch((error)=>{
        console.log(error);
        console.log(error.code);
        console.log(error.message);
    });
}