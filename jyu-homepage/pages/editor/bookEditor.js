import { useForm } from "react-hook-form";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import bookEditorStyle from '/styles/bookEditorStyle.module.scss';
import { useEffect } from "react";

function InputGroup(props) {
    
    useEffect(()=>{
        if(props.value != null && props.value != undefined){
            props.setValue(props.label, props.value);
            
        }
    })

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
            if(props.selectBook[key] != null && data[key] != props.selectBook[key]){
                reviseBook[key] = data[key];
            }
        });

        if(reviseBook != props.selectBook){
            const contentsRef = doc(getFirestore(), reviseBook["title"], "contents");
            await updateDoc(contentsRef, reviseBook);
            props.onHandleChange(reviseBook);

        }

        alert("변경이 완료 되었습니다.");
        
    }

    return(
        <>  
            {props.selectBook && 
                <div className={bookEditorStyle.container}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={bookEditorStyle.row}>
                            <input type="submit" value={props.selectBook.title === "" ? "New" : "Edit"} />
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
                        />
                        <InputGroup
                            errors={errors.image}
                            isTextarea={false}
                            label="image"
                            register={register("image")}
                            value={props.selectBook.image}
                            setValue={setValue}
                        />
                    </form>
                </div>
            }
        </>
    )
}