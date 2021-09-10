// It is derived from "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context"
// It also derived from "https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html"
// Rendering derived from "https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html" "rendering"
export const vsSource = `
    attribute vec4 a_position;

    void main(){
        gl_Position = a_position;
    }
    `

export const fsSource = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(1, 0, 0.5, 1);
    }
`

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