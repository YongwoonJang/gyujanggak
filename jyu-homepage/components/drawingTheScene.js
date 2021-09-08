// It is derived from "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context"
// It also derived from "https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html"
const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
    `


