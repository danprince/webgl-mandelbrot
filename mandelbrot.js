let canvas = document.createElement("canvas");
let width = canvas.width = 700;
let height = canvas.height = 700;
let gl = canvas.getContext("webgl");
let program = gl.createProgram();

let uniforms = {};
let attributes = {};
let buffers = {};

let settings = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  threshold: 4,
};

let viewport = {
  width: 3.5,
  height: 2,
  x: 0,
  y: 0,
};

async function load() {
  let [vertexShaderSource, fragmentShaderSource] = await Promise.all([
    await fetch("mandelbrot.vert").then(res => res.text()),
    await fetch("mandelbrot.frag").then(res => res.text()),
  ]);

  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.shaderSource(fragmentShader, fragmentShaderSource);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    let info = gl.getShaderInfoLog(vertexShader);
    throw new Error(info);
  }

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    let info = gl.getShaderInfoLog(fragmentShader);
    throw new Error(info);
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    let info = gl.getProgramInfoLog(program);
    throw new Error(info);
  }
}

function init() {
  gl.useProgram(program);

  attributes = {
    position: gl.getAttribLocation(program, "position"),
  };

  buffers = {
    position: gl.createBuffer(),
  };

  uniforms = {
    resolution: gl.getUniformLocation(program, "resolution"),
    threshold: gl.getUniformLocation(program, "threshold"),
    pan: gl.getUniformLocation(program, "pan"),
    zoom: gl.getUniformLocation(program, "zoom"),
  };

  let positions = Float32Array.from([
    -1, -1, 1, -1, -1, 1,
    1, -1, 1, 1, -1, 1
  ]);

  gl.enableVertexAttribArray(attributes.position);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  document.body.appendChild(canvas);
}

function render() {
  gl.viewport(0, 0, width, height);

  gl.enableVertexAttribArray(attributes.position);
  gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(uniforms.resolution, width, height);
  gl.uniform1f(uniforms.threshold, settings.threshold);
  gl.uniform2f(uniforms.pan, settings.pan.x, settings.pan.y);
  gl.uniform2f(uniforms.zoom, settings.zoom, settings.zoom);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

async function start() {
  await load();
  init();
  render();

  window.addEventListener("wheel", event => {
    if (event.ctrlKey) {
      settings.pan.x += event.deltaX / settings.zoom / 100;
      settings.pan.y -= event.deltaY / settings.zoom / 100;
    } else {
      settings.zoom -= event.deltaY / 10 * settings.zoom;
      settings.zoom = Math.max(1, settings.zoom);
    }

    event.preventDefault();
    render();
  }, { passive: false });
}

start().catch(console.error);
