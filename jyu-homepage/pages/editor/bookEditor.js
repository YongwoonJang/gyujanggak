import { useForm } from "react-hook-form";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import bookEditorStyle from '/styles/bookEditorStyle.module.scss';
import { useEffect, useState } from "react";
import utf8 from "utf8";

function InputGroup(props) {
    
    useEffect(()=>{
        if(props.value != null && props.value != undefined){
            if(props.label === "review"){
                try{
                    props.setValue(props.label, utf8.decode(props.value));
                }catch(e){
                    console.log(e);
                    props.setValue(props.label, props.value);
                }
            
            }else{
                props.setValue(props.label, props.value);
            }
            
        }
    })

    const onHandletextareaKeyUp = (e) => {
        if(e.ctrlKey && e.key === "s"){
            props.submit();
        }
    }

    const onHandletextareaKeydown = (e) => {
        let el = e.target;
        setTimeout(() => {
            el.style.cssText = "height:auto;";
            el.style.cssText = "height:" + el.scrollHeight + "px;";
        }, 0);
    }

    const onHandlePreviewChange = (e) => {
        if(e.target.name == "image"){
            const el = document.getElementById("preview");
            el.src = URL.createObjectURL(e.target.files[0]);
            props.setValue("image", e.target.files[0]);

        }
    }
    
    return (
        <div className={bookEditorStyle.row}>
            <div className={bookEditorStyle.col25}>
                <label for={props.label}>{props.label}</label>
            </div>
            <div className={bookEditorStyle.col75}>
                {props.isTextarea?
                    (<textarea
                        onKeyUp={onHandletextareaKeyUp}
                        id={props.label}
                        type="text"
                        placeholder={props.placeholder}
                        {...props.register}
                        onKeyDown={onHandletextareaKeydown}
                    />):
                    (<input
                        id={props.label}
                        type={props.label != "image"?"text":"file"}
                        placeholder={props.placeholder}
                        {...props.register}
                        onChange={onHandlePreviewChange}
                    />)}
                {!props.isTextarea && props.label=="image" && props.value != "" && <img id="preview" src={props.value}/>}
            </div>
            <div>
                {props.errors && <p className={bookEditorStyle.errorMsg}> {props.errors.message}</p>}
            </div>
        </div>
    )
}

function HistoryInputGroup(props){

    const [loanHistory, setLoanHistory ] = useState(null);
    const [newLoanHistory, setNewLoanHistory] = useState(null);
    const [isDelete, setIsDelete] = useState(false);
    const [deleteItemIndex, setDeleteItemIndex] = useState(-1);

    const setDeleteItem = (index) => {
        setDeleteItemIndex(index);
        setIsDelete(!isDelete);

    }

    const setTable = (elements) => {
        let tempTable = [];
        if(elements != undefined){
            elements.forEach((history) => {
                tempTable.push(
                    <>
                        <div className={(isDelete && (deleteItemIndex == elements.indexOf(history))) ? `${bookEditorStyle.row}  ${bookEditorStyle.select}` : `${bookEditorStyle.row}`} onClick={()=>{setDeleteItem(elements.indexOf(history));}}>
                            <div className={bookEditorStyle.col33}>{history.loanDate}</div>
                            <div className={bookEditorStyle.col33}>{history.returnDate==="null"?"대출 중":history.returnDate}</div>
                            <div className={bookEditorStyle.col33}>{history.borrower}</div>
                        </div>
                    </>
                );
            })
        }

        return tempTable
    }

    const onSubmit = (e) => {
        e.preventDefault();
        
        let newHistoryList = [];
        if(!isDelete){
            newHistoryList = newLoanHistory.slice();
            newHistoryList.push(
                {
                    "loanDate": document.getElementsByName("loanDate")[0].value,
                    "returnDate": document.getElementsByName("returnDate")[0].value,
                    "borrower": document.getElementsByName("borrower")[0].value
                }
            );
            
            setNewLoanHistory(newHistoryList);
            props.setValue("list", newHistoryList);
            
            //reset
            document.getElementsByName("loanDate")[0].value = "";
            document.getElementsByName("returnDate")[0].value = "";
            document.getElementsByName("borrower")[0].value = "";
        }else{
            newHistoryList = newLoanHistory.slice();
            newHistoryList.splice(deleteItemIndex, 1);
            setNewLoanHistory(newHistoryList);
            props.setValue("list", newHistoryList);
            setIsDelete(!isDelete);

        }


    }

    useEffect(()=>{
        if(loanHistory === null){
            
            setLoanHistory(props.value);
            setNewLoanHistory(props.value);
            props.setValue("list", props.value);
            
        }else{
            if(loanHistory != props.value){//if page is turned.
                setIsDelete(false);
                setDeleteItemIndex(null);
                setLoanHistory(props.value);
                setNewLoanHistory(props.value);
                props.setValue("list", props.value);
            
            }else{
                props.setValue("list", newLoanHistory);
            
            }
        }
    })

    return(
        <div className={`${bookEditorStyle.row}`} >
            
                <div className={bookEditorStyle.row}>
                    <div>
                        <label htmlFor={props.label}>{props.label}</label>
                    </div>
                </div>
                <div className={`${bookEditorStyle.row} ${bookEditorStyle.historyInputGroupContainer}`}>
                        <div className={bookEditorStyle.col25}>
                            <input 
                                type="submit"
                                value={!isDelete?"추가":"삭제"} 
                                onClick={onSubmit}    
                                />
                        </div>
                        <div className={bookEditorStyle.col75}>
                            <div className={bookEditorStyle.row}>
                                <div className={bookEditorStyle.col33}>대출일</div>
                                <div className={bookEditorStyle.col33}>반납일</div>
                                <div className={bookEditorStyle.col33}>빌린사람</div>
                            </div>
                            <div className={bookEditorStyle.row}>
                                <input 
                                    className={bookEditorStyle.col33}
                                    name="loanDate"
                                />
                                <input
                                    className={bookEditorStyle.col33}
                                    name="returnDate"
                                />
                                <input
                                    className={bookEditorStyle.col33}
                                    name="borrower"
                                    
                                />
                            </div>
                            {setTable(newLoanHistory)}
                        </div>
                </div>
            
        </div>
    )
}

export default function BookEditor(props){
    const {
        formState: {
            errors
        },
        handleSubmit,
        register,
        setValue
    } = useForm()
    
    const onSubmit = async (data) => {
        
        if(data.image.name != undefined){
            const storageRef = ref(getStorage(), "gyujanggak/"+data.image.name);
            await uploadBytes(storageRef,data.image);
            data.image = await getDownloadURL(storageRef);

        }

        let reviseBook = Object.assign({},props.selectBook);
        Object.keys(data).forEach((key)=>{
            if(key!= "list" && props.selectBook[key] != null && data[key] != props.selectBook[key]){
                if(key === "review"){
                    reviseBook[key] = utf8.encode(data[key]);
                }else{
                    reviseBook[key] = data[key];
                }
            }
        });


        if(reviseBook != props.selectBook || props.selectBook.list != data["list"]){
            const contentsRef = doc(getFirestore(), reviseBook["title"], "contents");
            await updateDoc(contentsRef, reviseBook);
            
            const addHistoryData = Object.assign(reviseBook,{"list":data["list"]});
            const loanHistoryRef = doc(getFirestore(), reviseBook["title"], "loanHistory");
            await updateDoc(loanHistoryRef, Object.assign({},{"list":addHistoryData["list"]}));

            props.onHandleChange(addHistoryData);

        }

        alert("변경이 완료 되었습니다.");
        
    }

    return(
        <>  
            {props.selectBook && 
                <div className={bookEditorStyle.container}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={bookEditorStyle.row}>
                            <input 
                                type="submit" 
                                value={props.selectBook.title === "" ? "New" : "Edit"} 
                                />
                        </div>
                        <InputGroup
                            errors={errors.title}
                            isTextarea={false}
                            label={"title"}
                            placeholder={"제목을 입력해 주세요."}
                            register={register("title")}
                            value={props.selectBook.title}
                            setValue={setValue}
                        />
                        <InputGroup
                            errors={errors.subtitle}
                            isTextarea={false}
                            label={"subtitle"}
                            placeholder={"부재를 적어주세요. 없으면 Pass"}
                            register={register("subtitle")}
                            value={props.selectBook.subtitle}
                            setValue={setValue}
                        />
                        <InputGroup
                            errors={errors.author}
                            isTextarea={false}
                            label={"author"}
                            placeholder={"저자를 적어주세요"}
                            register={register("author")}
                            value={props.selectBook.author}
                            setValue={setValue}
                        />
                        <InputGroup
                            errors={errors.publishDate}
                            isTextarea={false}
                            label={"publishDate"}
                            placeholder={"출간일을 적어주세요"}
                            register={register("publishDate")}
                            value={props.selectBook.publishDate}
                            setValue={setValue}
                        />
                        <InputGroup 
                            errors={errors.review} 
                            isTextarea={true}
                            label="review" 
                            register={register("review", { required: "리뷰를 입력해 주세요." })}
                            placeholder="리뷰를 입력해 주세요."
                            value={props.selectBook.review}
                            setValue={setValue} 
                            submit={handleSubmit(onSubmit)}
                        />
                        <InputGroup
                            errors={errors.image}
                            isTextarea={false}
                            label="image"
                            register={register("image")}
                            value={props.selectBook.image}
                            setValue={setValue}
                        />
                        <HistoryInputGroup
                            label="loanHistory"
                            register={register("list")}
                            value={props.selectBook.list}
                            selectBook={props.selectBook}
                            onHandleChange={props.onSelectBookChange}
                            setValue={setValue}
                        />
                    </form>
                </div>
            }
        </>
    )
}