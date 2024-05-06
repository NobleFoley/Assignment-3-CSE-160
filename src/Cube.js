class Cube {
  // Constructor
  constructor() {
    this.type = "cube";
    //this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 0.0, 0.0, 1.0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4();
    this.buffer = null;
    this.textureNum = -2;
  }
  // Render the shape * This is the Draw Cube function
  render() {
    //var xy = this.position;
    var rgba = this.color;

    if (this.buffer === null) {
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Front
    drawTriangles3DUV(
      [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0],
      [0, 0, 1, 1, 1, 0]
    );
    drawTriangles3DUV(
      [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0],
      [0, 0, 0, 1, 1, 1]
    );
    //drawTriangles3D([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0], this.buffer);
    //drawTriangles3D([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0], this.buffer);
    // Back
    // drawTriangles3D([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0], this.buffer);
    // drawTriangles3D([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0], this.buffer);

    drawTriangles3DUV(
      [0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0],
      [0, 0, 1, 1, 1, 0]
    );
    drawTriangles3DUV(
      [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      [0, 0, 0, 1, 1, 1]
    );

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.85,
      rgba[1] * 0.85,
      rgba[2] * 0.85,
      rgba[3]
    );

    // Top
    // drawTriangles3D([0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0], this.buffer);
    // drawTriangles3D([1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0], this.buffer);

    drawTriangles3DUV(
      [0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0],
      [0, 1, 0, 0, 1, 1]
    );
    drawTriangles3DUV(
      [1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0],
      [1, 0, 0, 0, 1, 1]
    );

    // Bottom
    // drawTriangles3D([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0], this.buffer);
    // drawTriangles3D([1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0], this.buffer);

    drawTriangles3DUV(
      [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
      [0, 1, 0, 0, 1, 1]
    );
    drawTriangles3DUV(
      [1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
      [1, 0, 0, 0, 1, 1]
    );
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.8,
      rgba[1] * 0.8,
      rgba[2] * 0.8,
      rgba[3]
    );

    // Left
    // drawTriangles3D([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0], this.buffer);
    // drawTriangles3D([0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0], this.buffer);

    drawTriangles3DUV(
      [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0],
      [1, 0, 0, 0, 1, 1]
    );
    drawTriangles3DUV(
      [0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0],
      [0, 1, 0, 0, 1, 1]
    );
    // Right
    // drawTriangles3D([1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0], this.buffer);
    // drawTriangles3D([1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0], this.buffer);

    drawTriangles3DUV(
      [1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0],
      [1, 0, 0, 0, 1, 1]
    );
    drawTriangles3DUV(
      [1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0],
      [0, 1, 0, 0, 1, 1]
    );
  }
}
