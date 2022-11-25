import { useForm } from 'react-hook-form';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import loginStyle from '/styles/loginStyle.module.scss';


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
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const router = useRouter();
    
    const {
        register,
        handleSubmit,
        formState:{
            errors
        }
    } = useForm();

    const onSubmit = (data) =>{
        let id = data.id;
        let pw = data.password;

        signInWithEmailAndPassword(auth, id, pw)
            .then((userCredential) => {
                router.push({
                    pathname: '/editor/profile'
                });

            })
            .catch((error) => {
                console.log("authentication failed");
                console.log(error.code);
                console.log(error.message);
                alert("아이디가 존재하지 않거나, 비밀번호가 틀렸습니다.");
            });

    }

    return(
        <>
            <div className={loginStyle.loginContainer}>
                <div className={loginStyle.titleGroup}>Manager</div>
                <div className={loginStyle.inputGroup}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={loginStyle.idInputGroup}>
                            <input
                                placeholder='아이디'
                                type="text"
                                {...register("id",{
                                    required: "아이디를 입력해주세요."
                                })}
                            />
                            {errors.id && <span className={loginStyle.idInputError}>{errors.id.message}</span>}
                        </div>
                        <div className={loginStyle.passwordInputGroup}>
                            <input
                                placeholder="비밀번호"
                                type="password"
                                {...register("password", {
                                    required: "비밀번호를 입력해 주세요."
                                })}
                            />
                            {errors.password && <span className={loginStyle.passwordInputError}>{errors.password.message}</span>}
                        </div>
                        <div className={loginStyle.buttonGroup}>
                            <input type="submit" value="login" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}