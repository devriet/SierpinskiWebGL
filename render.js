var gl;

function main() {
    let canvas = document.getElementById("my-canvas");

    // setupWebGL is defined in webgl-utils.js
    gl = WebGLUtils.setupWebGL(canvas);

    // Load the shader pair. 2nd arg is vertex shader, 3rd arg is fragment shader
    ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
        .then( (prog) => {

            gl.useProgram(prog);
            // Use black RGB=(0,0,0) for the clear color
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            // set up the 2D view port (0,0) is upper left (512,512) is lower right corner
            gl.viewport(0, 0, canvas.width, canvas.height);

            // clear the color buffer
            gl.clear(gl.COLOR_BUFFER_BIT);

            let vertices = [-0.8, -0.6,  0.7, -0.6,  -0.5, 0.7];
            createGasket(vertices, 2000);

            // create a buffer
            let vertexBuff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

            // copy the vertices data
            gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

            // obtain a reference to the shader variable (on the GPU)
            let posAttr = gl.getAttribLocation(prog, "vertexPos");
            gl.enableVertexAttribArray(posAttr);
            gl.vertexAttribPointer(posAttr,
                2,         /* number of components per attribute, in our case (x,y) */
                gl.FLOAT,  /* type of each attribute */
                false,     /* does not require normalization */
                0,         /* stride: number of bytes between the beginning of consecutive attributes */
                0);        /* the offset (in bytes) to the first component in the attribute array */
            gl.drawArrays(gl.POINTS,
                0,  /* starting index in the array */
                vertices.length/2); /* number of vertices to draw */
        });
}

function createGasket (inputArr, count) {
    //Pick an initial random point P inside the triangle
    r1 = Math.random();
    r2 = Math.random();
    p = [(1 - Math.sqrt(r1)) * inputArr[0] + (Math.sqrt(r1) * (1 - r2)) * inputArr[2] + (Math.sqrt(r1) * r2) * inputArr[4],
        (1 - Math.sqrt(r1)) * inputArr[1] + (Math.sqrt(r1) * (1 - r2)) * inputArr[3] + (Math.sqrt(r1) * r2) * inputArr[5]];
    c = 0;
    while (c < count) {
        //Select one of the three triangle vertices at random, call it V
        r = Math.floor(Math.random()*3);
        v = [inputArr[r*2], inputArr[r*2+1]];
        //Find a point Q halfway between P and V
        q = [p[0]-((p[0]-v[0])/2),p[1]-((p[1]-v[1])/2)];
        //Push the coordinates of Q to inputArr
        inputArr.push(q[0],q[1]);
        //Replace P with Q
        p = q;
        c++;
    }
}

function drawIt() {
    // Use black RGB=(0,0,0) for the clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // clear the color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);
}