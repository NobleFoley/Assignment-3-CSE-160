// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position =u_ProjectionMatrix* u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
      
    }
    if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);
      
    }
    if (u_whichTexture == -0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
      
    }
    if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
      
    }
  }`;

let canvas;
let gl;
let a_Position;
let u_GlobalRotateMatrix;
let a_UV;
let u_FragColor;
//let u_Size;
let u_ModelMatrix;
let u_Sampler0;
let u_Sampler1;
let u_ViewMatrix;
let u_ProjectionMatrix;

function setUpWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if (a_UV < 0) {
    console.log("Failed to get the storage location of a_UV");
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(
    gl.program,
    "u_GlobalRotateMatrix"
  );
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get the storage location of u_GlobalRotateMatrix");
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get the storage location of u_whichTexture");
    return;
  }

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if (!u_Sampler0) {
    console.log("Failed to get the storage location of u_Sampler0");
    return false;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("Failed to get the storage location of u_ViewMatrix");
    return false;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix) {
    console.log("Failed to get the storage location of u_ProjectionMatrix");
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler1) {
    console.log("Failed to get the storage location of u_Sampler1");
    return false;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Globals for UI Elements
let g_globalAngle = [0, 0];
let g_tail_endAngle = 0;
let g_tail_middleAngle = 0;
let g_tail_baseAngle = 0;
let g_headAngle = 0;
let g_bodyAngle = 0;
let g_feetAngle = 0;
let g_tail_endAnimation = false;
let g_tail_middle_Animation = false;
let g_tail_baseAnimation = false;
let g_headAnimation = false;
let g_bodyAnimation = false;
let g_feetAnimation = false;

function addActionsForHtmlUI() {
  document.getElementById("tail_end_animation_on").onclick = function () {
    g_tail_endAnimation = true;
  };
  document.getElementById("tail_end_animation_off").onclick = function () {
    g_tail_endAnimation = false;
  };

  document.getElementById("tail_middle_animation_on").onclick = function () {
    g_tail_middle_Animation = true;
  };
  document.getElementById("tail_middle_animation_off").onclick = function () {
    g_tail_middle_Animation = false;
  };

  document.getElementById("tail_base_animation_on").onclick = function () {
    g_tail_baseAnimation = true;
  };
  document.getElementById("tail_base_animation_off").onclick = function () {
    g_tail_baseAnimation = false;
  };
  document.getElementById("head_animation_on").onclick = function () {
    g_headAnimation = true;
  };
  document.getElementById("head_animation_off").onclick = function () {
    g_headAnimation = false;
  };
  document.getElementById("body_animation_on").onclick = function () {
    g_bodyAnimation = true;
  };
  document.getElementById("body_animation_off").onclick = function () {
    g_bodyAnimation = false;
  };
  document.getElementById("feet_animation_on").onclick = function () {
    g_feetAnimation = true;
  };
  document.getElementById("feet_animation_off").onclick = function () {
    g_feetAnimation = false;
  };
  document.getElementById("all_animation_on").onclick = function () {
    g_tail_endAnimation = true;
    g_tail_middle_Animation = true;
    g_tail_baseAnimation = true;
    g_headAnimation = true;
    g_bodyAnimation = true;
    g_feetAnimation = true;
  };
  document.getElementById("all_animation_off").onclick = function () {
    g_tail_endAnimation = false;
    g_tail_middle_Animation = false;
    g_tail_baseAnimation = false;
    g_headAnimation = false;
    g_bodyAnimation = false;
    g_feetAnimation = false;
  };

  document
    .getElementById("tail_end_input")
    .addEventListener("input", function () {
      g_tail_endAngle = this.value;
      renderAllShapes();
    });
  document
    .getElementById("tail_middle_input")
    .addEventListener("input", function () {
      g_tail_middleAngle = this.value;
      renderAllShapes();
    });
  document
    .getElementById("tail_base_input")
    .addEventListener("input", function () {
      g_tail_baseAngle = this.value;
      renderAllShapes();
    });
  document.getElementById("head_input").addEventListener("input", function () {
    g_headAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("body_input").addEventListener("input", function () {
    g_bodyAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("feet_input").addEventListener("input", function () {
    g_feetAngle = this.value;
    renderAllShapes();
  });
  document
    .getElementById("camera_input")
    .addEventListener("input", function () {
      g_globalAngle = [this.value, 0];
      renderAllShapes();
    });
}

function initTextures() {
  var image = new Image(); // Create the image object
  if (!image) {
    console.log("Failed to create the image object");
    return false;
  }
  var image1 = new Image(); // Create the image object
  if (!image1) {
    console.log("Failed to create the image object");
    return false;
  }

  // Register the event handler to be called on loading an image
  image.onload = function () {
    sendTextureToGLSL(image, 0, u_Sampler0);
  };
  image1.onload = function () {
    sendTextureToGLSL(image1, 1, u_Sampler1);
  };
  // Tell the browser to load an image
  image.src = "../resources/sky.jpg";
  image1.src = "../resources/leaves-forest-ground-256x256.jpg";
  image1.onerror = function () {
    console.error("Failed to load image at " + image1.src);
    // Load a default texture or handle the error in another way
  };
}

function sendTextureToGLSL(image, unit, sampler) {
  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable the texture unit
  console.log(gl.TEXTURE0);
  // gl.TEXTURE0 + unit reference: https://stackoverflow.com/questions/43066304/webgl2-explanation-for-gl-texture0-n
  gl.activeTexture(gl.TEXTURE0 + unit);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit to the sampler
  gl.uniform1i(sampler, unit);
}

let g_jawAnimation = false;

function main() {
  setUpWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  document.onkeydown = keydown;
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function (ev) {
    if (ev.shiftKey) {
      g_jawAnimation = !g_jawAnimation;
    }
  };
  canvas.onmousemove = function (ev) {
    if (ev.buttons == 1) {
      click(ev);
    }
  };

  initTextures(gl, 0);
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

function keydown(ev) {
  if (ev.keyCode == 87) {
    moveForward();
  }
  if (ev.keyCode == 83) {
    moveBackward();
  }
  if (ev.keyCode == 65) {
    moveLeft();
  }
  if (ev.keyCode == 68) {
    moveRight();
  }

  renderAllShapes();
  console.log("move achieved");
}

var g_startTime = performance.now() / 1000;
var g_seconds = performance.now() / 1000 - g_startTime;

function tick() {
  g_seconds = performance.now() / 1000 - g_startTime;
  //console.log(g_seconds);

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}

var g_shapesList = [];

function click(ev) {
  // Passes event to function to convert into WebGL coords
  let [x, y] = handleClicks(ev);
  g_globalAngle = [x * 75, y * 75];
  //console.log(g_globalAngle);
}

function handleClicks(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return [x, y];
}

function updateAnimationAngles() {
  if (g_tail_endAnimation) {
    g_tail_endAngle = 20 * Math.sin(2.5 * g_seconds);
  }
  if (g_tail_middle_Animation) {
    g_tail_middleAngle = 20 * Math.sin(3 * g_seconds);
  }
  if (g_tail_baseAnimation) {
    g_tail_baseAngle = 20 * Math.sin(3 * g_seconds);
  }
  if (g_headAnimation) {
    g_headAngle = 5 * Math.sin(2 * g_seconds);
  }
  if (g_bodyAnimation) {
    g_bodyAngle = 5 * Math.sin(2 * g_seconds);
  }
  if (g_feetAnimation) {
    g_feetAngle = 8 * Math.sin(2 * g_seconds);
  }
}

let g_eye = new Vector3([0, 0, -3]);
let g_at = new Vector3([0, 0, 100]);
let g_up = new Vector3([0, 1, 0]);

function moveForward() {
  d_at = new Vector3().set(g_at);
  d = d_at.sub(g_eye);
  d = d.normalize();

  g_eye.add(d);
  g_at.add(d);
}

function moveBackward() {
  d_at = new Vector3().set(g_at);
  d = d_at.sub(g_eye);
  d = d.normalize();

  g_eye = g_eye.sub(d);
  g_at = g_at.sub(d);
}

function moveLeft() {
  d_at = new Vector3().set(g_at);
  d = d_at.sub(g_eye);
  left = Vector3.cross(d, g_up);
  left.normalize();

  g_eye.sub(left);
  g_at.sub(left);
}

function moveRight() {
  d_at = new Vector3().set(g_at);
  d = d_at.sub(g_eye);
  right = Vector3.cross(d, g_up);
  right.normalize();

  g_eye = g_eye.add(right);
  g_at = g_at.add(right);
}

function renderAllShapes() {
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();

  viewMat.setLookAt(
    g_eye.elements[0],
    g_eye.elements[1],
    g_eye.elements[2],
    g_at.elements[0],
    g_at.elements[1],
    g_at.elements[2],
    g_up.elements[0],
    g_up.elements[1],
    g_up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4()
    .rotate(-g_globalAngle[0], 0, 1, 0)
    .rotate(g_globalAngle[1], 1, 0, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var ground_plane = new Cube();
  ground_plane.textureNum = 1;
  ground_plane.matrix.translate(-7.5, -0.3, -7.5);
  ground_plane.matrix.scale(15, 0, 15);

  ground_plane.render();

  var sky_box = new Cube();
  sky_box.textureNum = 0;
  sky_box.matrix.scale(25, 25, 25);
  sky_box.matrix.translate(-0.5, -0.5, -0.5);
  sky_box.render();

  drawCroc();

  var duration = performance.now() - startTime;
  sendTextToHTML(
    " ms: " +
      Math.floor(duration) +
      " fps: " +
      Math.floor(10000 / duration) / 10,
    "performance_text"
  );
}

function drawCroc() {
  function drawLeg(body_coords) {
    var leg = new Cube();
    leg.color = [0.034, 0.5, 0.05, 1];
    leg.matrix = new Matrix4(body_coords);
    leg.matrix.rotate(g_feetAngle, 0, 0, 1);
    leg.matrix.translate(0.1, -0.22, -0.15);
    leg.matrix.rotate(-90, 1, 0, 0);
    var leg_coord = leg.matrix;
    leg.matrix.scale(0.08, 0.08, 0.1);

    var leg_joint = new Cylinder();
    leg_joint.color = [0.034, 0.3, 0.05, 1];
    leg_joint.matrix = new Matrix4(leg_coord);
    leg_joint.matrix.scale(0.5, 0.5, 0.8);
    leg_joint.matrix.translate(1.5, 1.2, 0);
    var legjoint_coord = leg_joint.matrix;
    leg_joint.matrix.rotate(-90, 1, 0, 0);

    var foot = new Cube();
    foot.color = [0.034, 0.2, 0.05, 1];
    foot.matrix = new Matrix4(legjoint_coord);
    foot.matrix.translate(-0.5, 0.5, -0.5);
    foot.matrix.scale(1.5, 0.5, 2);

    return [leg, leg_joint, foot];
  }

  function drawTeeth(jaw_coords) {
    var tooth = new Cube();
    tooth.color = [1, 1, 1, 1];
    tooth.matrix = new Matrix4(jaw_coords);
    tooth.matrix.scale(0.03, 0.02, 0.05);
    return tooth;
    ///tooth.render();
  }

  var body = new Cube();
  body.color = [0.034, 0.5, 0.05, 1];
  body.matrix.rotate(g_bodyAngle, 0, 1, 0);
  var body_coords = new Matrix4(body.matrix);
  body.matrix.translate(-0.15, -0.25, 0.0);
  body.matrix.rotate(-90, 1, 0, 0);
  body.matrix.scale(0.25, 0.5, 0.2);
  body.render();

  var outer_body_shell = new Cube();
  outer_body_shell.color = [0.1, 0.4, 0.05, 1];
  outer_body_shell.matrix = new Matrix4(body_coords);
  outer_body_shell.matrix.translate(-0.17, -0.24, -0.05);
  outer_body_shell.matrix.rotate(-90, 1, 0, 0);
  outer_body_shell.matrix.scale(0.3, 0.4, 0.2);
  outer_body_shell.render();

  var head = new Cube();
  head.color = [0.1, 0.4, 0.05, 1];
  head.matrix = new Matrix4(body_coords);
  head.matrix.rotate(g_headAngle, 0, 1, 0);
  head.matrix.translate(-0.12, -0.28, -0.5);
  var head_coords = new Matrix4(head.matrix);
  head.matrix.scale(0.2, 0.22, 0.2);
  head.matrix.rotate(-90, 1, 0, 0);
  head.render();

  var eyes = new Cylinder();
  eyes.color = [0, 0, 0, 1];
  eyes.matrix = new Matrix4(head_coords);
  eyes.matrix.rotate(-90, 0, 0, 1);
  eyes.matrix.scale(0.04, 0.21, 0.04);
  eyes.matrix.translate(-4, 0.47, -2);
  eyes.render();

  var lower_jaws = new Cube();
  lower_jaws.color = [0.034, 0.35, 0.05, 1];
  lower_jaws.matrix = new Matrix4(head_coords);
  lower_jaws.matrix.translate(0.01, 0.02, -0.2);
  if (g_jawAnimation) {
    g_jawAngle = 15 * Math.sin(5 * g_seconds);
    if (g_jawAngle > 0) {
      lower_jaws.matrix.rotate(-g_jawAngle, 1, 0, 0);
    }
  }
  var jaw_coords = new Matrix4(lower_jaws.matrix);
  lower_jaws.matrix.rotate(-90, 1, 0, 0);
  lower_jaws.matrix.scale(0.18, 0.25, 0.05);
  lower_jaws.render();

  var tooth1 = drawTeeth(jaw_coords);
  tooth1.matrix.translate(0.25, 1.5, -4);
  tooth1.render();
  var tooth2 = drawTeeth(jaw_coords);
  tooth2.matrix.translate(4.7, 1.5, -4);
  tooth2.render();
  var tooth3 = drawTeeth(jaw_coords);
  tooth3.matrix.translate(0.25, 1.5, -2);
  tooth3.render();
  var tooth4 = drawTeeth(jaw_coords);
  tooth4.matrix.translate(4.7, 1.5, -2);
  tooth4.render();
  var tongue = new Cube();
  tongue.color = [1 * 0.85, 0, 0.4 * 0.85, 1];
  tongue.matrix = new Matrix4(jaw_coords);
  tongue.matrix.scale(0.05, 0.025, 0.15);
  tongue.matrix.translate(1.35, 1.5, -1);
  tongue.render();

  var upper_jaw = new Cube();
  upper_jaw.color = [0.034, 0.3, 0.05, 1];
  upper_jaw.matrix = new Matrix4(head_coords);
  upper_jaw.matrix.translate(0.01, 0.07, -0.205);
  if (g_jawAnimation) {
    g_jawAngle = 15 * Math.sin(5 * g_seconds);
    if (g_jawAngle > 0) {
      upper_jaw.matrix.rotate(g_jawAngle, 1, 0, 0);
    }
  }
  upper_jaw.matrix.rotate(-90, 1, 0, 0);
  upper_jaw.matrix.scale(0.18, 0.25, 0.05);
  upper_jaw.render();

  var backright_legs = drawLeg(body_coords);
  backright_legs[0].render();
  backright_legs[1].render();
  backright_legs[2].render();
  var frontright_legs = drawLeg(body_coords);
  frontright_legs[0].matrix.translate(0, 2, 0);
  frontright_legs[0].render();
  frontright_legs[1].matrix.translate(0, -0.2, 4);
  frontright_legs[1].render();
  frontright_legs[2].matrix.translate(0, -0.4, 1.8);
  frontright_legs[2].render();
  var backleft_legs = drawLeg(body_coords);
  backleft_legs[0].matrix.translate(-4, 0, 0);
  backleft_legs[0].render();
  backleft_legs[1].matrix.translate(-9, 0, 0);
  backleft_legs[1].render();
  backleft_legs[2].matrix.translate(-6.3, 0, 0);
  backleft_legs[2].render();
  var frontleft_legs = drawLeg(body_coords);
  frontleft_legs[0].matrix.translate(-4, 2, 0);
  frontleft_legs[0].render();
  frontleft_legs[1].matrix.translate(-9, -0.2, 4);
  frontleft_legs[1].render();
  frontleft_legs[2].matrix.translate(-6.3, -0.4, 1.8);
  frontleft_legs[2].render();

  var tail = new Cylinder();
  tail.color = [0.1, 0.4, 0.05, 1];
  tail.matrix = new Matrix4(body_coords);
  tail.matrix.rotate(g_tail_baseAngle, 0, 1, 0);
  var tail_coords = new Matrix4(tail.matrix);
  tail.matrix.scale(0.15, 0.15, 0.15);
  tail.matrix.translate(-0.15, -1, 0);
  tail.matrix.rotate(-90, 1, 0, 0);
  tail.render();

  var tail1 = new Cylinder();
  tail1.color = [0.034, 0.35, 0.05, 1];
  tail1.matrix = tail_coords;
  tail1.matrix.translate(-0.025, -0.15, 0.125);
  tail1.matrix.scale(0.125, 0.125, 0.125);
  tail1.matrix.rotate(g_tail_middleAngle, 0, 1, 0);
  var tail2_coords = new Matrix4(tail1.matrix);
  tail1.matrix.rotate(-90, 1, 0, 0);
  tail1.render();

  var tail2 = new Cylinder();
  tail2.color = [0.034, 0.2, 0.05, 1];
  tail2.matrix = tail2_coords;
  tail2.matrix.rotate(-90, 1, 0, 0);
  tail2.matrix.rotate(g_tail_endAngle, 0, 0, 1);
  tail2.matrix.translate(-0.025, -0.8, 0);
  tail2.matrix.scale(0.8, 0.8, 0.8);
  tail2.render();

  var spikes = new Cube();
  spikes.color = [0.034, 0.3, 0.05, 1];
  spikes.matrix = new Matrix4(body_coords);
  spikes.matrix.rotate(0, 1, 0, 0);
  spikes.matrix.scale(0.05, 0.05, 0.08);
  spikes.matrix.translate(-0.8, -1.5, -5);
  spikes.render();

  var spikes2 = new Cube();
  spikes2.color = [0.034, 0.3, 0.05, 1];
  spikes2.matrix = new Matrix4(body_coords);
  spikes2.matrix.rotate(0, 1, 0, 0);
  spikes2.matrix.scale(0.05, 0.05, 0.08);
  spikes2.matrix.translate(-0.8, -1.5, -3.2);
  spikes2.render();

  var spikes3 = new Cube();
  spikes3.color = [0.034, 0.3, 0.05, 1];
  spikes3.matrix = new Matrix4(body_coords);
  spikes3.matrix.rotate(0, 1, 0, 0);
  spikes3.matrix.scale(0.05, 0.05, 0.08);
  spikes3.matrix.translate(-0.8, -1.5, -1.8);
  spikes3.render();
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
  }
  htmlElm.innerHTML = text;
}
