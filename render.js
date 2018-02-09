var gl;
var rotAngle = 0.0;
var angleUni, colorUni, transAttribute;
var vertices;
var levSlider, spdSlider, randomizer;
var levels;
var increment = 0, lastUpdate = 0;
var transx = 0.0, transy = 0.0;
//var temp;
var original = [-0.8, -0.6,  0.7, -0.6,  -0.5, 0.7];
var vertexBuff;
var canvas;

function main() {
    initialSetup();
    setupEventHandlers();
    // Load the shader pair. 2nd arg is vertex shader, 3rd arg is fragment shader
    ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
        .then( (prog) => {
            gl.useProgram(prog);
            gl.clearColor(0.0, 0.0, 0.0, 1.0); // Use black RGB=(0,0,0) for the clear color
            gl.viewport(0, 0, canvas.width, canvas.height); // set up the 2D view port (0,0)
                                            // is upper left (512,512) is lower right corner
            gl.clear(gl.COLOR_BUFFER_BIT); // clear the color buffer
            vertices = []; // empties the vertices array
            createTriangle(original, levels); // makes a call to the function which creates the sierpinski triangles
            vertexBuff = gl.createBuffer(); // create a buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff); // links the buffer here to the buffer in the vertex shader
            gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW); // copy the vertices data
            let posAttr = gl.getAttribLocation(prog, "vertexPos"); // obtain a reference to the shader variable (on the GPU)
            transAttribute = gl.getUniformLocation(prog, "translation");
            angleUni = gl.getUniformLocation(prog, "angle"); // obtains a reference to the angle in the vertex shader
            colorUni = gl.getUniformLocation(prog, "mycolor"); // obtains a reference to the color in the fragment shader
            //gl.uniform3f(colorUni, 0.7, 0.0, 0.4); // sets color
            setRandomColor();
            gl.enableVertexAttribArray(posAttr); //
            gl.vertexAttribPointer(posAttr, //
                2,         /* number of components per attribute, in our case (x,y) */
                gl.FLOAT,  /* type of each attribute */
                false,     /* does not require normalization */
                0,         /* stride: number of bytes between the beginning of consecutive attributes */
                0);        /* the offset (in bytes) to the first component in the attribute array */
            gl.drawArrays(gl.TRIANGLES,
                0,  /* starting index in the array */
                vertices.length/2); /* number of vertices to draw */
            levSlider.oninput = function () {
                levels = this.value;
                for (let i = vertices.length; i > 0; i--) {
                    vertices.pop();
                }
                console.log(vertices);
                createTriangle([-0.8, -0.6,  0.7, -0.6,  -0.5, 0.7], levels);
                gl.clear(gl.COLOR_BUFFER_BIT);
                // gl.deleteBuffer(vertexBuff);
                // gl.clear(gl.ARRAY_BUFFER);
                // gl.clear(gl.COLOR_BUFFER_BIT);
                vertexBuff = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
                gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);
                gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);
            };
            window.requestAnimationFrame(updateMe);
            window.requestAnimationFrame(animRedraw);
        });
}

function initialSetup() {
    canvas = document.getElementById("my-canvas"); // obtains reference to canvas
    levSlider = document.getElementById("levelSlider"); // obtains reference to slider
    spdSlider = document.getElementById("speedSlider"); // obtains reference to slider
    randomizer = document.getElementById("randomizer"); // obtains reference to slider
    levels = levSlider.value; // takes value from slider reference
    gl = WebGLUtils.setupWebGL(canvas); // setupWebGL is defined in webgl-utils.js
}

function setupEventHandlers() {
    spdSlider.oninput = function () {
        increment = this.value;
    };
    randomizer.oninput = function () {
        window.requestAnimationFrame(setRandomColor());
    };
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) {
            transx -= 0.2;
            //alert('Left was pressed');
        }
        else if(event.keyCode == 38) {
            transy += 0.2;
            //alert('Up was pressed');
        }
        else if(event.keyCode == 39) {
            transx += 0.2;
            //alert('Right was pressed');
        }
        else if(event.keyCode == 40) {
            transy -= 0.2;
            //alert('Down was pressed');
        }
        //transAttribute =
    });
}

function setRandomColor() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform3f(colorUni, Math.random(), Math.random(), Math.random()); // sets color
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);
    //window.requestAnimationFrame(updateMe);
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

function createTriangle (inputArr, count) {
    if (count < 1) {
        //draw triangle
        for (let i = 0; i < 6; i++) {
            vertices.push(inputArr[i]);
        }
    } else {
        let midpoints = [(inputArr[0] - ((inputArr[0] - inputArr[2])/2.0)),
            (inputArr[1] - ((inputArr[1] - inputArr[3])/2.0)),
            (inputArr[2] - ((inputArr[2] - inputArr[4])/2.0)),
            (inputArr[3] - ((inputArr[3] - inputArr[5])/2.0)),
            (inputArr[4] - ((inputArr[4] - inputArr[0])/2.0)),
            (inputArr[5] - ((inputArr[5] - inputArr[1])/2.0))];
        createTriangle([inputArr[0], inputArr[1],
            midpoints[0], midpoints[1],
            midpoints[4], midpoints[5]], count - 1);
        createTriangle([inputArr[2], inputArr[3],
            midpoints[2], midpoints[3],
            midpoints[0], midpoints[1]], count - 1);
        createTriangle([inputArr[4], inputArr[5],
            midpoints[4], midpoints[5],
            midpoints[2], midpoints[3]], count - 1);
    }
}

function updateMe (time) {
    rotAngle = rotAngle + (increment * (Math.PI / 180.0));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(angleUni, rotAngle);
    gl.uniform2f(transAttribute, transx, transy);
    gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);
    window.requestAnimationFrame(updateMe);
}

function animRedraw (time) {
    if (time - lastUpdate > 250) {

    }

    window.requestAnimationFrame(animRedraw);
}

function drawIt() {
    // Use black RGB=(0,0,0) for the clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // clear the color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);
}