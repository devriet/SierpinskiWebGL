// in fshader.glsl
precision mediump float;
uniform vec3 mycolor;
void main() {
    gl_FragColor.rgb = mycolor;
    gl_FragColor.a = 1.0;
}