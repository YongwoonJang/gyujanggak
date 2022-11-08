
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
        const destination = baseURL + '/addBook';
        let url = new URL(destination);
        let params = { 'user': userHash, 'title': data.title, 'contents': data.contents };
        url.search = new URLSearchParams(params).toString();
        fetch(url);
        reset();
        
    }

    useEffect(()=>{
        try {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in
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
                            {errors.title && <p>errors.title.message</p>}
                        </div>
                        <div>
                            <label>contents</label>
                            <textarea 
                                id="contents"
                                {...register("contents",{
                                    required: "내용을 입력해 주세요."
                                })}
                            />
                            {errors.contents && <p>errors.contents.message</p>}
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