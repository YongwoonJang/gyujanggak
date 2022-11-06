import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import mgmtStyle from '/styles/mgmtStyle.module.scss';


const firebaseConfig = {
    apiKey: "AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0",
    authDomain: "gyujanggak-99e8a.firebaseapp.com",
    databaseURL: "https://gyujanggak-99e8a-default-rtdb.firebaseio.com",
    projectId: "gyujanggak-99e8a",
    storageBucket: "gyujanggak-99e8a.appspot.com",
    messagingSenderId: "442347175475",
    appId: "1:442347175475:web:ea5374ac2d0c8458972d46"
};

export default function Login() {
    const router = useRouter();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const {
        register,
        handleSubmit,
        formState:{
            error
        }
    } = useForm();
    const onSubmit = (data) =>{
        let id = data.id;
        let pw = data.password;

        signInWithEmailAndPassword(auth, id, pw)
            .then((userCredential) => {
                let user = userCredential.user;
                router.push({
                    pathname: '/editor/profile',
                    query: { user: user.email }
                });

            })
            .catch((error) => {
                console.log("authentication failed");
                console.log(error.code);
                console.log(error.message);
            });

    }

    return(
        <>
            <form className={mgmtStyle.loginForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={mgmtStyle.loginTitle}>
                    <label> Management </label>
                </div>
                <div className={mgmtStyle.loginInput}>
                    <input 
                        type="text"
                        {...register("id")}
                    />
                    <input 
                        type="password" 
                        {...register("password")} />
                </div>
                <div className={mgmtStyle.loginBtn}>
                    <button type="submit">Connect</button>
                </div>
            </form>
        </>
    )
}