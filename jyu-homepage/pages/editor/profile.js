import { useRouter } from "next/router";

export default function Profile(){

    const router = useRouter();

    //check wether user is logined. 
    const user = router.query.user;
    console.log(router);

    if (!user || user.isLoggedIn == false) {
        //redirect to login page.
        return <div>Loading....</div>

    }

    //else print user information
    return(
        <>
            <h1>Hello Editor Yongun</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
    )
}