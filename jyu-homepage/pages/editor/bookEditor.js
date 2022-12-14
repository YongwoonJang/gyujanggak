import { useForm } from "react-hook-form";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, updateDoc, setDoc } from "firebase/firestore";
import bookEditorStyle from '/styles/bookEditorStyle.module.scss';
import InputGroup from "./utils/inputGroup.js"
import HistoryInputGroup from './utils/historyInputGroup.js'
import utf8 from "utf8";


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
        
        if(props.selectBook.title != ""){
            //Modify
            if(data.image.name != undefined){
                const storageRef = ref(getStorage(), "gyujanggak/"+data.image.name);
                await uploadBytes(storageRef,data.image);
                data.image = await getDownloadURL(storageRef);

            }

            let reviseBook = Object.assign({},props.selectBook);
            Object.keys(data).forEach((key)=>{
                if(props.selectBook[key] != null && data[key] != props.selectBook[key]){
                    if(key === "review"){
                        reviseBook[key] = utf8.encode(data[key]);
                    }else{
                        reviseBook[key] = data[key];
                    }
                }
            });


            if(reviseBook != props.selectBook || props.selectBook.loanHistory != data["loanHistory"]){
                const contentsRef = doc(getFirestore(), "bookList", reviseBook["isbn"]);
                await updateDoc(contentsRef, reviseBook);
                props.onHandleChange(reviseBook);

            }
            alert("변경이 완료 되었습니다.");
        }else{
            //Create
            if (data.image.name != undefined) {
                const storageRef = ref(getStorage(), "gyujanggak/" + data.image.name);
                await uploadBytes(storageRef, data.image);
                data.image = await getDownloadURL(storageRef);

            }

            const newDocRef = doc(getFirestore(), "bookList", data.isbn);
            data.loanHistory = [];
            await setDoc(newDocRef, data);

            alert("추가가 완료 되었습니다.");

        }
        
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
                        {props.selectBook.title === "" &&
                            <InputGroup
                                errors={errors.isbn}
                                isTextarea={false}
                                label={"isbn"}
                                placeholder={"ISBN을 입력해 주세요."}
                                register={register("isbn", {required:"ISBN 정보를 입력해 주세요."})}
                                value={props.selectBook.isbn}
                                setValue={setValue}
                            />
                        }
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
                            register={register("review")}
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
                            register={register("loanHistory")}
                            value={props.selectBook.loanHistory}
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