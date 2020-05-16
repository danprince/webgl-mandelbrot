attribute vec4 position;

uniform vec2 pan;
uniform vec2 zoom;

varying vec2 start_point;
varying vec2 end_point;

void main() {
  vec2 start = vec2(-2, -1);
  vec2 end = vec2(1, 1);
  vec2 bounds = end - start;
  vec2 center = start + bounds / 2.0;

  center = center + pan;
  bounds = bounds / zoom;

  start_point = center - bounds / 2.0;
  end_point = center + bounds / 2.0;

  gl_Position = position;
}
