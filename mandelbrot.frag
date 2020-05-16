precision highp float;

const int max_iterations = 1000;

uniform vec2 resolution;
uniform float threshold;

varying vec2 start_point;
varying vec2 end_point;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 mandelbrot(vec2 point) {
  highp vec2 scaled = start_point + ((end_point - start_point) * point / resolution);

  float x = 0.0;
  float y = 0.0;

  int iterations = 0;

  for (int i = 1; i <= max_iterations; i++) {
    iterations = i;

    float _x = x * x - y * y + scaled.x;
    y = 2.0 * x * y + scaled.y;
    x = _x;

    if (x * x + y * y > threshold) {
      break;
    }
  }

  float v = float(iterations) / float(max_iterations) * 30.0;

  if (iterations == max_iterations) {
    return vec4(0, 0, 0, 1);
  } else {
    float h = 0.7 - v * 0.02;
    float s = 0.8;
    float l = float(iterations) / (float(iterations) + 10.0);
    vec3 hsv = vec3(h, s, l);
    vec3 rgb = hsv2rgb(hsv);
    return vec4(rgb, 1);
  }
}

void main() {
  gl_FragColor = mandelbrot(gl_FragCoord.xy);
}
