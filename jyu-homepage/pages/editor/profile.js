
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { createHash } from 'crypto';
import mgmtStyle from '/styles/mgmtStyle.module.scss';

const baseURL = "https://gyujanggak.vercel.app/api";
// const baseURL = "http://localhost:80" 

export default function Profile(){
    const router = useRouter();
    const loginSuccess = useRef(null);
    const defaultPage = useRef(null);
    
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
        console.log(data);
        const storage = getStorage();
        
        const curr = new Date();
        const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        let newId = utc + KR_TIME_DIFF;

        const storageRef = ref(storage, userHash+'/'+newId+data.image[0].name);

        uploadBytes(storageRef,data.image[0]).then((snapshot) => {
            console.log('Upload file success');
            console.log(snapshot);
        })
        console.log("uploadByte is success");

        const destination = baseURL + '/addBook';
        let url = new URL(destination);
        let params = { 
            'user': userHash, 
            'title': "gyujanggak", 
            'contents_title': data.title,
            'contents': data.contents,
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
                    loginSuccess.current.style.display = "block";
                    defaultPage.current.style.display = "none";
                    userHash = createHash('sha256').update(user.uid).digest('hex');

                }
            })

        } catch (e) {
            console.log("Error is " + e);
            console.log("Not permitted access");
            router.push({
                pathname: '/auth/login'

            });
        }
    })

    //else print user information
    return(
        <>
            <div>
                <div ref={defaultPage}>
                    <a href="https://gyujanggak.vercel.app/auth/login">Need to log in</a>
                </div >

                <div ref={loginSuccess} className={mgmtStyle.main}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={mgmtStyle.mainTitle}>
                            <h1>Hello: Editor Yongun</h1>
                        </div>
                        <div>
                            <label>title</label>
                            <input 
                                type= "text"
                                {...register("title",{
                                    required: "제목을 입력해 주세요."
                                })}
                            />
                            {errors.title && <p>{errors.title.message}</p>}
                        </div>
                        <div>
                            <label>contents</label>
                            <textarea 
                                type="text"
                                {...register("contents",{
                                    required: "내용을 입력해 주세요."
                                })}
                            />
                            {errors.contents && <p>{errors.contents.message}</p>}
                        </div>
                        <div>
                            <label>Image</label>
                            <input type="file"
                                {...register("image",{
                                    required: "이미지를 등록해 주세요."
                                })}
                            />
                            {errors.image && <p>errors.image.message</p>}
                        </div>
                        <div>
                            <button type="submit">Post</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}