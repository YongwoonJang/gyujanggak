import page from "/styles/page.module.scss";
import parse from 'html-react-parser'
import Image from 'next/image'
import React from 'react'

export default function RequestFormAndResult(){
    const myRef = React.createRef(null);

    let allPostsData = [
        { "date":"2021-08-30 23:34", "title":"Hello", "contents":"JYU World. this homepage is for JYU. He is interested in Data and Informations", "hit":20, "img":"None"},
        { "date": "2021-08-30 23:41", "title": "단상", "contents": "내가 깊게 생각하는 그 부분을 다른 사람이 이해해줄 수 있을까. <br/> 다름의 문제에서 내가 떳떳하게 나의 다름을 표현할 수 있을까. <br/> 그냥 나는 이렇게 남의 눈치만 보며 앞으로 나아가게 되는 것일까. </br> 마음 깊이 사람들이 싫어하는 마음이 생겨서 결국 인간관계를 포기하게 되는 때가 많다.<br/>어떻게 그 인간관계를 유지할 수 있을까.내가 잘못된 것일까.", "hit": 20000, "img":"/images/moment.jpeg" }
    ]

    const sendRequestData = async event => {
        event.preventDefault();
        let searchInput = document.getElementById("data").value;
        document.getElementById("result").innerHTML = searchInput;
    }

    const canvas = myRef.current.focus();
    console.log(canvas);
    const gl = canvas.getContext("webgl");

    if (gl == null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    return(
        <>
            <canvas ref={myRef} width="640" height="480"></canvas>
            <div className={page.communicationInput}>
                <form onSubmit={sendRequestData} >
                    <input id="data" name="data"/>
                    <button type="submit">쓰기</button>
                </form>
            </div>
            <div id="result" className={page.communicationDialogue}/>
            {allPostsData.map(({ date, title, contents, hit, img }) => (
                <>
                <div className={page.communicationDialogue}>
                    <div>{title}</div>
                    <div>{parse(contents)}</div>
                    <div>{img != "None"? <Image src= {img} width={500} height={500}></Image> : <br/>} </div>
                    <div>LIKE : {hit}</div>
                    <div>{date}</div>
                </div>
                </>
            ))}
        </>
    )
}