// Three.js WebGL canvas with distortion shader

import * as THREE from 'three';
import type { WebGLConfig, ThemeColors } from '../../types/portfolio';

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let mesh: THREE.Mesh | null = null;
let uniforms: Record<string, THREE.IUniform> | null = null;
let animationFrameId: number | null = null;

// Distortion vertex shader
const vertexShader = `
uniform float uTime;
uniform float uScrollVelocity;
uniform vec2 uMouse;
uniform float uDistortion;

varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Mouse-driven displacement
  float dist = distance(uv, uMouse);
  float influence = smoothstep(0.8, 0.0, dist);
  pos.z += influence * uDistortion * 0.4;

  // Scroll velocity warps mesh
  pos.z += sin(uv.x * 6.0 + uTime * 0.8) * uScrollVelocity * 0.08;
  pos.z += cos(uv.y * 4.0 + uTime * 0.6) * uScrollVelocity * 0.05;

  // Ambient motion
  pos.z += sin(uv.x * 3.0 + uTime * 0.4) * 0.03;
  pos.z += cos(uv.y * 5.0 + uTime * 0.3) * 0.02;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

// Distortion fragment shader
const fragmentShader = `
uniform vec3 uAccent;
uniform vec3 uBackground;
uniform float uOpacity;
uniform float uTime;

varying vec2 vUv;

void main() {
  // Vertical gradient blend
  float t = smoothstep(0.0, 1.0, vUv.y + sin(uTime * 0.3) * 0.1);
  vec3 col = mix(uBackground, uAccent, t * 0.15);

  // Edge vignette
  float vignette = smoothstep(0.0, 0.5, distance(vUv, vec2(0.5)));
  col = mix(col, uBackground, vignette * 0.6);

  gl_FragColor = vec4(col, uOpacity * (1.0 - vignette * 0.4));
}
`;

export function initWebGL(store: { webgl: WebGLConfig; theme: { colors: ThemeColors } }): void {
  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Scene & camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 1;

  // Uniforms
  uniforms = {
    uTime: { value: 0 },
    uScrollVelocity: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uAccent: { value: new THREE.Color(store.theme.colors.accent) },
    uBackground: { value: new THREE.Color(store.theme.colors.background) },
    uDistortion: { value: store.webgl.uniforms.uDistortion as number },
    uOpacity: { value: store.webgl.opacity },
  };

  // Geometry
  const geometry = new THREE.PlaneGeometry(2.5, 2.5, 128, 128);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene!.add(mesh);

  // Events
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  render();
}

function onMouseMove(e: MouseEvent): void {
  if (!uniforms) return;
  uniforms.uMouse.value.set(
    e.clientX / window.innerWidth,
    1 - e.clientY / window.innerHeight
  );
}

function onResize(): void {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onVisibilityChange(): void {
  if (document.hidden) {
    stop();
  } else {
    render();
  }
}

function render(): void {
  if (!renderer || !scene || !camera) return;

  const tick = (time: number) => {
    if (!uniforms) return;
    uniforms.uTime.value = time * 0.001;
    renderer!.render(scene!, camera!);
    animationFrameId = requestAnimationFrame(tick);
  };
  animationFrameId = requestAnimationFrame(tick);
}

function stop(): void {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/** Call when theme colours change */
export function updatePalette(colors: ThemeColors): void {
  if (!uniforms) return;
  (uniforms.uAccent.value as THREE.Color).set(colors.accent);
  (uniforms.uBackground.value as THREE.Color).set(colors.background);
}

/** Set a WebGL uniform from the builder */
export function setUniform(key: string, value: number | number[]): void {
  if (!uniforms || !uniforms[key]) return;
  if (typeof value === 'number') {
    uniforms[key].value = value;
  } else if (Array.isArray(value) && value.length === 3) {
    (uniforms[key].value as THREE.Color).setRGB(value[0], value[1], value[2]);
  }
}
