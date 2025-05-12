// Hero WebGL Aurora/Plasma Background Animation
(function () {
  if (!window.THREE) return;
  const canvas = document.getElementById('hero-bg-canvas');
  if (!canvas) return;

  // Set up renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);

  // Scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Aurora/Plasma Shader
  const uniforms = {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#E60000') }, // Red
    uColorB: { value: new THREE.Color('#004E89') }, // Blue
    uColorC: { value: new THREE.Color('#FFC107') }, // Gold
    uColorD: { value: new THREE.Color('#333333') }, // Dark for highlight
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorA, uColorB, uColorC, uColorD;
      uniform vec2 uResolution;
      
      // 2D noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        uv.x *= uResolution.x / uResolution.y;
        float t = uTime * 0.25;
        
        // Aurora bands
        float bands = 0.0;
        for (int i = 0; i < 3; i++) {
          float speed = float(i+1) * 0.2 + 0.2;
          float freq = float(i+2) * 2.0;
          float amp = 0.18 + 0.08 * float(i);
          bands += sin((uv.y + t * speed) * freq + sin(uv.x * 2.0 + t * 0.7)) * amp;
        }
        
        // Plasma warping
        float plasma = sin(uv.x * 8.0 + t * 2.0) * 0.15 + cos(uv.y * 8.0 - t * 1.5) * 0.15;
        float n = noise(uv * 3.0 + t * 0.5) * 0.2;
        float y = uv.y + bands + plasma + n;
        
        // Color stops
        vec3 color = uColorA;
        color = mix(color, uColorB, smoothstep(0.2, 0.45, y));
        color = mix(color, uColorC, smoothstep(0.45, 0.7, y));
        color = mix(color, uColorD, smoothstep(0.7, 0.95, y));
        
        // Add highlight
        float highlight = smoothstep(0.85, 1.0, y) * 0.7;
        color += uColorD * highlight;
        
        // Vivid contrast
        color = pow(color, vec3(1.1));
        
        gl_FragColor = vec4(color, 0.92);
      }
    `,
    transparent: true,
    depthWrite: false,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Responsive resize
  function resize() {
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Animation loop
  let running = true;
  function animate() {
    if (!running) return;
    uniforms.uTime.value += 0.006;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    running = false;
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  });
})(); 