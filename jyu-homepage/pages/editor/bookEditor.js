
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createHash } from 'crypto';
import bookEditorStyle from '/styles/bookEditorStyle.module.scss';

const baseURL = "https://gyujanggak.vercel.app/api";
// const baseURL = "http://localhost:80" 

export default function BookEditor(props){
    const router = useRouter();
    let userHash = null;

    const {
        register,
        handleSubmit,
        reset,
        formState:{
            errors
        }
    } = useForm()
    
    const onSubmit = (data) => {
        const storage = getStorage();
        const curr = new Date();
        const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        let newId = utc + KR_TIME_DIFF;

        const storageRef = ref(storage, userHash+'/'+newId+data.image[0].name);

        uploadBytes(storageRef,data.image[0]).then(() => {
            alert('등록이 완료되었습니다.');
        
        })

        const destination = baseURL + '/addBook';
        let url = new URL(destination);
        let params = { 
            'user': userHash, 
            'title': "gyujanggak", 
            'contents_title': props.value.title,
            'contents': props.value.contents,
            'image': newId + data.image[0].name 
        };
        url.search = new URLSearchParams(params).toString();
        fetch(url);
        reset();
        
    }

    useEffect(()=>{
        try {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User signed in
                    userHash = createHash('sha256').update(user.uid).digest('hex');

                }
            })

        } catch (e) {
            alert("로그인이 필요한 페이지 입니다.");
            router.push({
                pathname: '/auth/login'

            });
        }

        let textarea = document.getElementsByName("contents")[0];
        textarea.style.cssText = "height:" + textarea.scrollHeight + "px;";

    })

    const onHandleChange = (e) => {
        props.onHandleChange(e.target.value);

    }

    const onHandletextareaKeydown = (e) => {
        let el = e.target;
        setTimeout(() => {
            el.style.cssText = "height:auto;";
            el.style.cssText = "height:" + el.scrollHeight + "px;";
        }, 0);
    }

    //else print user information
    return(
        <>  
            <div className={bookEditorStyle.container}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={bookEditorStyle.row}>
                        <div className={bookEditorStyle.col25}>
                            <label>title</label>
                        </div>
                        <div className={bookEditorStyle.col75}>
                            <input 
                                type= "text"
                                placeholder= "책이름, 출간년월, 저자를 입력해 주세요...삼국지, (2022년5월, 나관중)"
                                {...register("title",{
                                    required: "제목을 입력해 주세요."
                                })}
                                value= {props.value.title}
                                onChange= {onHandleChange}
                            />
                        </div>
                        <div>
                            {errors.title && <p className={bookEditorStyle.errorMsg}> {errors.title.message}</p>}
                        </div>
                    </div>
                    <div className={bookEditorStyle.row}>
                        <div className={bookEditorStyle.col25}>
                            <label>contents</label>
                        </div>
                        <div className={bookEditorStyle.col75}>
                            <textarea 
                                type="text"
                                placeholder="책을 감상한 느낌을 적어주세요...."
                                {...register("contents",{
                                    required: "내용을 입력해 주세요."
                                })}
                                value={props.value.content===null?"":props.value.content}
                                onChange={onHandleChange}
                                onKeyDown={onHandletextareaKeydown}
                            />
                        </div>
                        <div>
                            {errors.contents && <p className={bookEditorStyle.errorMsg}> {errors.contents.message}</p>}
                        </div>
                    </div>
                    <div className={bookEditorStyle.row}>
                        <div className={bookEditorStyle.col25}>
                            <label>Image</label>
                        </div>
                        <div className={bookEditorStyle.col75}>
                            {props.value.image &&
                                <img src={props.value.image} />
                            }
                            <input type="file"
                                {...register("image",{
                                    required: "이미지를 등록해 주세요."
                                })}
                            />
                        </div>
                        <div>
                            {errors.image && <p className={bookEditorStyle.errorMsg}> {errors.image.message}</p>}
                        </div>
                    </div>
                    <div className={bookEditorStyle.row}>
                        <input type="submit" value="Post" />
                    </div>
                </form>
            </div>
                
        </>
    )
}