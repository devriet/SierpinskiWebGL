// in vshader.glsl
uniform float angle;
attribute vec2 vertexPos;  // each incoming vertex is (x,y)
void main() {
  gl_PointSize = 2.0;
  gl_Position.x = cos(angle) * vertexPos.x - sin(angle) * vertexPos.y;
  gl_Position.y = sin(angle) * vertexPos.x + cos(angle) * vertexPos.y;
  gl_Position.z = 0.0;
  gl_Position.w = 1.0;
  //gl_Position = vec4 (vertexPos, 0.0, 1.0);
}