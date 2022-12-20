export default function sortBookListByTitle(bookList){

    let localDocs = [];
    bookList.forEach((doc) =>{
        if(localDocs.length === 0 ){
            localDocs.push(doc);
        }
        for(let i = 0; i < localDocs.length; i++){       
            if (doc.data().title < localDocs[i].data().title){
                localDocs.splice(i,0,doc);
                break;

            }else{
                if(i === localDocs.length -1 ){
                    if(doc.data().title !== localDocs[i].data().title){
                        localDocs.push(doc);
                    }
                }

            }
            
        }
    })

    return localDocs;
}