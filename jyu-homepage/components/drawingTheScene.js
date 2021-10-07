import {mat4} from 'gl-matrix'

//WebGL Source code
export const vsSource = `
    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;
    
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    varying highp vec2 vTextureCoord;

    void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
    `

export const fsSource = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    
    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`
//Define global variables for drawing
let deltaTime = 0;
let then = 0;
let squareRotation = 0;
let localGL = null;
let localProgramInfo = null;
let localBuffer = null;
let localTexture = null;
let horizontal = 0.0;
let vertical = 0.0;
let controlMatrix = [0, 0,];

// WebGL Shader functions
export function createShader(gl, type, source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// WebGL Program function.
export function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export function initBuffer(gl){
    var position = [
        -1.0, -1.0,
         1.0, -1.0,
         1.0, 1.0,
        -1.0, 1.0,
    ]

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
    
    return({position:positionBuffer})
}

//init 
export function drawScene(gl, programInfo, buffers){
    //Initialize and local* variables are transferred to render function
    localGL = gl;
    localProgramInfo = programInfo;
    localBuffer = buffers;

    gl.clearColor((161+horizontal*-80.32)/255, (73+horizontal*170.22)/255, (1+vertical*200.22)/255, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFERR_BIT);
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

    //Define variables
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);
    
    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix,
        modelViewMatrix,
        [horizontal, vertical, -6.0]);
    
    mat4.rotate(modelViewMatrix,
        modelViewMatrix,
        squareRotation,
        [0, 1, 0]);
    
    // How to get buffer in position
    {
        const num = 2; 
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, localBuffer.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            num,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    // How to get buffer in texture.
    {
        const num = 2; // every coordinate composed of 2 values
        const type = gl.FLOAT; // the data in the buffer is 32 bit float
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set to the next
        const offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, localBuffer.textureCoord);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord, 
            num, 
            type, 
            normalize, 
            stride, 
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_FAN, offset, vertexCount);
    }

    squareRotation += deltaTime;

}

//Render data and make call back
export function render(now) {
    movingAround();
    now *= 0.001;
    deltaTime = now - then;
    then = now; 
    drawScene(localGL, localProgramInfo, localBuffer, localTexture);
    
    requestAnimationFrame(render);

}

export function movingAround() {
    if (vertical < 1.00 && controlMatrix[0] == 0){
        vertical = vertical + 0.003;

    } else if (vertical > -1 && controlMatrix[0] == 1){
        vertical = vertical - 0.005;

    } 

    if (horizontal < 1.00 && controlMatrix[1] == 0){
        horizontal = horizontal + 0.001;

    } else if (horizontal > -1 && controlMatrix[1] == 1){
        horizontal = horizontal - 0.005;
    }

    if (vertical >= 1){
        controlMatrix[0] = 1;

    }else if (vertical <= -1){
        controlMatrix[0] = 0;
    
    }else if (horizontal >= 1){
        controlMatrix[1] = 1;
    
    }else if (horizontal <= -1){
        controlMatrix[1] = 0;

    }
    
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;

}