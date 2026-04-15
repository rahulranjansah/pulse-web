import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Interactive 3D Pulse Visualization using Three.js
 * Shows a chirped Gaussian pulse as a 3D surface you can rotate and zoom.
 */
export function PulseDesigner3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    mesh: THREE.Mesh;
    animationId: number;
  } | null>(null);

  // Pulse parameters
  const [pulseWidth, setPulseWidth] = useState(30);
  const [chirp, setChirp] = useState(0);
  const [wavelength, setWavelength] = useState(800);
  const [animating, setAnimating] = useState(true);

  // Derived values
  const frequency = (299792458 / (wavelength * 1e-9) / 1e12).toFixed(1);
  const bandwidth = (0.44 / (pulseWidth * 1e-15) / 1e12 * Math.sqrt(1 + chirp * chirp)).toFixed(1);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(3, 2, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Controls - orbit around the pulse
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(6, 20, 0xcccccc, 0xe5e5e5);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(2);
    axesHelper.position.set(-2.5, -1, -2.5);
    scene.add(axesHelper);

    // Create initial mesh (will be updated)
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      side: THREE.DoubleSide,
      metalness: 0.1,
      roughness: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      mesh,
      animationId: 0,
    };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    let time = 0;
    const animate = () => {
      if (!sceneRef.current) return;
      sceneRef.current.animationId = requestAnimationFrame(animate);
      sceneRef.current.controls.update();
      time += 0.016;
      sceneRef.current.renderer.render(
        sceneRef.current.scene,
        sceneRef.current.camera
      );
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        container.removeChild(sceneRef.current.renderer.domElement);
      }
    };
  }, []);

  // Update pulse geometry when parameters change
  useEffect(() => {
    if (!sceneRef.current) return;

    const { scene, mesh } = sceneRef.current;

    // Remove old mesh
    scene.remove(mesh);
    mesh.geometry.dispose();

    // Create new geometry for the pulse surface
    const segmentsT = 100; // time segments
    const segmentsY = 40;  // transverse segments
    const geometry = new THREE.BufferGeometry();

    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    const tau_G = pulseWidth / Math.sqrt(2 * Math.log(2));
    const omega0 = 2 * Math.PI * 299792458 / (wavelength * 1e-9);
    const chirpParam = chirp * 2;

    // Generate surface vertices
    for (let j = 0; j <= segmentsY; j++) {
      for (let i = 0; i <= segmentsT; i++) {
        // Time: -100 to 100 fs, mapped to -3 to 3
        const tNorm = (i / segmentsT) * 2 - 1; // -1 to 1
        const t = tNorm * 100; // fs
        const x = tNorm * 3; // spatial coordinate

        // Transverse: -1 to 1
        const yNorm = (j / segmentsY) * 2 - 1;
        const z = yNorm * 1.5;

        // Gaussian envelope in time
        const envT = Math.exp(-(t * t) / (tau_G * tau_G));

        // Gaussian envelope in transverse direction (beam profile)
        const envY = Math.exp(-(yNorm * yNorm) * 2);

        // Combined envelope
        const envelope = envT * envY;

        // Carrier with chirp
        const phase = omega0 * t * 1e-15 * 0.1 + chirpParam * tNorm * tNorm * 10;
        const carrier = Math.cos(phase * 30);

        // Electric field value -> height
        const field = envelope * carrier;
        const y = field * 1.2;

        vertices.push(x, y, z);

        // Color based on instantaneous frequency (chirp visualization)
        const instFreq = 1 + chirpParam * tNorm;
        const hue = 0.0 + (instFreq - 1) * 0.15; // red to orange/yellow
        const color = new THREE.Color();
        color.setHSL(Math.max(0, Math.min(0.15, hue)), 0.8, 0.5 + envelope * 0.2);
        colors.push(color.r, color.g, color.b);
      }
    }

    // Generate indices for triangles
    for (let j = 0; j < segmentsY; j++) {
      for (let i = 0; i < segmentsT; i++) {
        const a = j * (segmentsT + 1) + i;
        const b = a + 1;
        const c = a + (segmentsT + 1);
        const d = c + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Material with vertex colors
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      metalness: 0.2,
      roughness: 0.4,
      flatShading: false,
    });

    const newMesh = new THREE.Mesh(geometry, material);
    scene.add(newMesh);
    sceneRef.current.mesh = newMesh;

    // Add wireframe overlay for better depth perception
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
    scene.add(wireframe);

    // Add envelope outline
    const envelopeCurve: THREE.Vector3[] = [];
    for (let i = 0; i <= segmentsT; i++) {
      const tNorm = (i / segmentsT) * 2 - 1;
      const t = tNorm * 100;
      const x = tNorm * 3;
      const envT = Math.exp(-(t * t) / (tau_G * tau_G));
      envelopeCurve.push(new THREE.Vector3(x, envT * 1.2, 0));
    }
    const envelopeGeometry = new THREE.BufferGeometry().setFromPoints(envelopeCurve);
    const envelopeLine = new THREE.Line(
      envelopeGeometry,
      new THREE.LineBasicMaterial({ color: 0x991b1b, linewidth: 2 })
    );
    scene.add(envelopeLine);

    // Lower envelope
    const lowerEnvelopeCurve = envelopeCurve.map(
      (p) => new THREE.Vector3(p.x, -p.y, 0)
    );
    const lowerEnvelopeGeometry = new THREE.BufferGeometry().setFromPoints(lowerEnvelopeCurve);
    const lowerEnvelopeLine = new THREE.Line(
      lowerEnvelopeGeometry,
      new THREE.LineBasicMaterial({ color: 0x991b1b, linewidth: 2 })
    );
    scene.add(lowerEnvelopeLine);

  }, [pulseWidth, chirp, wavelength]);

  // Toggle auto-rotation
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.controls.autoRotate = animating;
    }
  }, [animating]);

  return (
    <section id="designer" className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Interactive 3D Pulse Visualization
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Drag to rotate, scroll to zoom. See how chirp affects your ultrafast pulse in real-time.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-4">
          {/* 3D Viewer */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-4 py-2">
                <span className="text-sm text-zinc-600">
                  Electric Field E(t, y)
                </span>
                <button
                  onClick={() => setAnimating(!animating)}
                  className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-900"
                >
                  {animating ? "Pause" : "Rotate"}
                </button>
              </div>
              <div
                ref={containerRef}
                className="h-[500px] w-full cursor-grab active:cursor-grabbing"
              />
            </div>
            <p className="mt-3 text-center text-sm text-zinc-500">
              Color indicates instantaneous frequency — {chirp > 0 ? "red→orange (up-chirp)" : chirp < 0 ? "shifting with down-chirp" : "uniform (no chirp)"}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-6 border border-zinc-200 bg-white p-6">
            <h3 className="text-sm font-medium text-zinc-700">Pulse Parameters</h3>

            {/* Pulse Width */}
            <div>
              <label className="flex items-center justify-between text-sm text-zinc-700">
                <span>Pulse Width</span>
                <span className="font-mono font-semibold text-zinc-900">{pulseWidth} fs</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={pulseWidth}
                onChange={(e) => setPulseWidth(Number(e.target.value))}
                className="mt-2 w-full accent-red-600"
              />
            </div>

            {/* Chirp */}
            <div>
              <label className="flex items-center justify-between text-sm text-zinc-700">
                <span>Chirp</span>
                <span className="font-mono font-semibold text-zinc-900">
                  {chirp === 0 ? "0" : chirp > 0 ? `+${chirp.toFixed(1)}` : chirp.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={chirp}
                onChange={(e) => setChirp(Number(e.target.value))}
                className="mt-2 w-full accent-red-600"
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-400">
                <span>Down</span>
                <span>Up</span>
              </div>
            </div>

            {/* Wavelength */}
            <div>
              <label className="flex items-center justify-between text-sm text-zinc-700">
                <span>Wavelength</span>
                <span className="font-mono font-semibold text-zinc-900">{wavelength} nm</span>
              </label>
              <input
                type="range"
                min="400"
                max="1600"
                step="50"
                value={wavelength}
                onChange={(e) => setWavelength(Number(e.target.value))}
                className="mt-2 w-full accent-red-600"
              />
            </div>

            {/* Derived values */}
            <div className="border-t border-zinc-100 pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Calculated
              </h4>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Frequency</dt>
                  <dd className="font-mono font-medium text-zinc-900">{frequency} THz</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Bandwidth</dt>
                  <dd className="font-mono font-medium text-zinc-900">{bandwidth} THz</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Transform Limited</dt>
                  <dd className={`font-medium ${chirp === 0 ? "text-green-600" : "text-amber-600"}`}>
                    {chirp === 0 ? "Yes" : "No"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                setPulseWidth(30);
                setChirp(0);
                setWavelength(800);
              }}
              className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
