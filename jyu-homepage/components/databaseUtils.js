// const baseURL = "http://localhost:80";
const baseURL = "https://gyujanggak.vercel.app/api";

export async function readDatabase(name) {
    const destination = baseURL + '/readDatabase';
    let url = new URL(destination)

    let params = { 'name': name } // or:
    url.search = new URLSearchParams(params).toString();

    const querySnapshot = await fetch(url);
    const result = await querySnapshot.json();
    return result['data'];

}

//Insert to database and update comments array.
export function insertRow(author, contents, setComments) {

    let destination = baseURL + '/insertRow';
    let url = new URL(destination)

    let params = { 'author': author, 'contents': contents } // or:
    url.search = new URLSearchParams(params).toString();

    fetch(url);
    //setComments(await readDatabase('gyujanggak'));
}

//Delete from database and update comments array
export function deleteRow(localDelDocId, setComments) {

    let destination = baseURL + '/deleteRow';
    var url = new URL(destination)

    var params = { 'localDelDocId': localDelDocId } // or:
    url.search = new URLSearchParams(params).toString();

    fetch(url);
    //setComments(await readDatabase('gyujanggak'));
}
