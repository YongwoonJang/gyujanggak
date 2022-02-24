import { vsSource, fsSource, createShader, createProgram, initBuffer, render } from './drawingTheScene'
import { drawScene } from './drawingTheScene'
import React, { useEffect } from 'react'

export default function WebGl() {

    //WebGL Part
    useEffect(() => {
        // Init variables
        const canvas = document.querySelector('#glCanvas');

        // Set side to fit to parent.
        let rect = canvas.parentNode.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;


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
                vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
                textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),

            },
        };

        // Setting the buffer
        const buffer = initBuffer(gl);

        // draw scene
        drawScene(gl, programInfo, buffer);
        requestAnimationFrame(render);

    })

    return (
        <>
            <canvas id="glCanvas"></canvas>
        </>
    )

}