import { admin } from 'firebase';

// const baseURL = "http://localhost:80";
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

    // let destination = baseURL + '/insertRow';
    let destination = baseURL + '/insertRowWithoutSignIn';
    let url = new URL(destination)

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

export function signIn(){

    let destination = baseURL + '/signIn';
    let url = new URL(destination)

    fetch(url)
    .then((data)=>{
        console.log("after sign in complete then");
        return data.json();
    })
    .then((result)=>{
        console.log("after promise is resovled");
        console.log(result);
        const auth = admin.auth();
        
        auth.verifyIdToken(result)
        .then((decodedToken) => {
                console.log(decodedToken);
        })

    });

}