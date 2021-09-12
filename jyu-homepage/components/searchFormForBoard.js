import page from '/styles/page.module.scss'
import parse from 'html-react-parser'
import Image from 'next/image'
import React, {useEffect} from 'react'
import {vsSource, fsSource, createShader, createProgram} from '/components/drawingTheScene'
import { drawScene } from './drawingTheScene'


export default function RequestFormAndResult(){

    let allPostsData = [
        { "date":"2021-08-30 23:34", "title":"Hello", "contents":"JYU World. this homepage is for JYU. He is interested in Data and Informations", "hit":20, "img":"None"},
        { "date": "2021-08-30 23:41", "title": "단상", "contents": "내가 깊게 생각하는 그 부분을 다른 사람이 이해해줄 수 있을까. <br/> 다름의 문제에서 내가 떳떳하게 나의 다름을 표현할 수 있을까. <br/> 그냥 나는 이렇게 남의 눈치만 보며 앞으로 나아가게 되는 것일까. </br> 마음 깊이 사람들이 싫어하는 마음이 생겨서 결국 인간관계를 포기하게 되는 때가 많다.<br/>어떻게 그 인간관계를 유지할 수 있을까.내가 잘못된 것일까.", "hit": 20000, "img":"/images/moment.jpeg" }
    ]

    const sendRequestData = async event => {
        event.preventDefault();
        let searchInput = document.getElementById("data").value;
        document.getElementById("result").innerHTML = searchInput;
    }

    useEffect(()=>{
        const canvas = document.querySelector('#glCanvas')
        
        // Init Canvas size
        const canvasToDisplaySizeMap = new Map([[canvas, [300, 150]]]);
        const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas);

        // React to adjusting canvas size
        const resizeObserver =  new ResizeObserver(onResize);
        resizeObserver.observe(canvas, {box: 'content-box'});

        // Adjust Canvas size
        const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
        if (needResize) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }

        // Create Shader program
        const gl = canvas.getContext("webgl");
        if (gl == null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        }
        var vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
        var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        var program = createProgram(gl, vertexShader, fragmentShader);


        //Setting the program 
        const programInfo = {
            program: program,
            attribLocations: {
                vertexPosition : gl.getAttribLocation(program, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
            },
        };

        //Setting the buffer
        //Get a location, color and matrix
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var positions = [
            1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        //draw scene
        // draw something.
        drawScene(gl, programInfo, {position: positionBuffer,});

        // Setting the size
        function onResize(entries) {
            for (const entry of entries) {
                let width;
                let height;
                let dpr = window.devicePixelRatio;
                if (entry.devicePixelContentBoxSize) {
                    width = entry.devicePixelContentBoxSize[0].inlineSize;
                    height = entry.devicePixelContentBoxSize[0].blockSize;

                } else if (entry.contentBoxSize) {
                    if (entry.contentBoxSize[0]) {
                        width = entry.contentBoxSize[0].inlineSize;
                        height = entry.contentBoxSize[0].blockSize;

                    } else if (entry.contentBoxSize) {
                        width = entry.contentBoxSize.inlineSize;
                        height = entry.contentBoxSize.blockSize;

                    }
                } else {
                    width = entry.contentRect.width;
                    height = entry.contentRect.height;

                }
                const displayWidth = Math.round(width * dpr);
                const displayHeight = Math.round(height * dpr);
                canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
            }
        }
    })

    return(
        <>
            <div className={page.communicationLab}>
                <canvas id="glCanvas" width="400" height="300"></canvas>
            </div>
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