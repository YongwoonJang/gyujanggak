export default function bubbleSortForBookTitleByAlpahbet(bookList){

    for (let i = 0;i < bookList.length; i++){
        for(let j = 0;j <bookList.length; j++){
            if(bookList[i].title < bookList[j].title){
                let temp = bookList[j];
                temp = bookList[j];
                bookList[j] = bookList[i];
                bookList[i] = temp;
                
            }
        }

    } 

    return bookList;
}