import { useForm } from 'react-hook-form';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
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
            errors
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
                alert("아이디가 존재하지 않거나, 비밀번호가 틀렸습니다.");
            });

    }

    return(
        <>
        <div className={mgmtStyle.login}>
            <div className={mgmtStyle.desc}>
                <h2>
                    관리자 페이지
                </h2>
                <p>
                    개발자, 서비스 기획자 장용운의 공간입니다.
                </p>
            </div>
            <div className={mgmtStyle.container}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={mgmtStyle.row}>
                        <div className={mgmtStyle.col25}>
                            <label>ID </label>
                        </div>
                        <div className={mgmtStyle.col75}>
                            <input 
                                type="text"
                                {...register("id",{
                                    required: "아이디를 입력해주세요."
                                })}
                            />
                        </div>
                        <div>
                            {errors.id && <p className={mgmtStyle.errorMsg}>{errors.id.message}</p>}
                        </div>
                    </div>
                    <div className={mgmtStyle.row}>
                        <div className={mgmtStyle.col25}>
                            <label>비밀 번호 </label>
                        </div>
                        <div className={mgmtStyle.col75}>
                            <input
                                type="password"
                                {...register("password", {
                                    required: "비밀번호를 입력해 주세요."
                                })}
                            />
                        </div>
                        <div>
                                {errors.password && <p className={mgmtStyle.errorMsg}>{errors.password.message}</p>}
                        </div>
                    </div>
                    <div className={mgmtStyle.row}>
                        <input type="submit" value="login" />
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}