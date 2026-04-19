import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * 3D Semiconductor Bloch Equations Visualizer
 * Shows carrier population dynamics, coherence, and energy bands
 * in an interactive 3D representation.
 */
export function SBEVisualizer3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    animationId: number;
    time: number;
    electrons: THREE.Points;
    holes: THREE.Points;
    coherence: THREE.Line;
  } | null>(null);

  const [excitation, setExcitation] = useState(0.5);
  const [temperature, setTemperature] = useState(300);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(4, 3, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff4444, 1, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x4444ff, 0.5, 20);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // === Energy Band Structure ===
    // Conduction band (upper parabola)
    const conductionBandGeometry = new THREE.BufferGeometry();
    const cbPoints: number[] = [];
    for (let k = -2; k <= 2; k += 0.1) {
      const E = 1.5 + 0.3 * k * k; // Parabolic dispersion
      cbPoints.push(k, E, 0);
    }
    conductionBandGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(cbPoints, 3)
    );
    const conductionBand = new THREE.Line(
      conductionBandGeometry,
      new THREE.LineBasicMaterial({ color: 0xff6b6b, linewidth: 3 })
    );
    scene.add(conductionBand);

    // Valence band (lower parabola)
    const valenceBandGeometry = new THREE.BufferGeometry();
    const vbPoints: number[] = [];
    for (let k = -2; k <= 2; k += 0.1) {
      const E = -0.3 * k * k; // Parabolic dispersion (inverted)
      vbPoints.push(k, E, 0);
    }
    valenceBandGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vbPoints, 3)
    );
    const valenceBand = new THREE.Line(
      valenceBandGeometry,
      new THREE.LineBasicMaterial({ color: 0x6b6bff, linewidth: 3 })
    );
    scene.add(valenceBand);

    // Band gap label plane
    const bandGapGeometry = new THREE.PlaneGeometry(0.8, 0.3);
    const bandGapMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const bandGapPlane = new THREE.Mesh(bandGapGeometry, bandGapMaterial);
    bandGapPlane.position.set(2.5, 0.75, 0);
    scene.add(bandGapPlane);

    // === Electron particles in conduction band ===
    const electronCount = 100;
    const electronPositions = new Float32Array(electronCount * 3);
    const electronColors = new Float32Array(electronCount * 3);
    const electronSizes = new Float32Array(electronCount);

    for (let i = 0; i < electronCount; i++) {
      const k = (Math.random() - 0.5) * 3;
      const E = 1.5 + 0.3 * k * k + (Math.random() - 0.5) * 0.3;
      const z = (Math.random() - 0.5) * 2;

      electronPositions[i * 3] = k;
      electronPositions[i * 3 + 1] = E;
      electronPositions[i * 3 + 2] = z;

      // Red color for electrons
      electronColors[i * 3] = 1;
      electronColors[i * 3 + 1] = 0.3;
      electronColors[i * 3 + 2] = 0.3;

      electronSizes[i] = 5 + Math.random() * 5;
    }

    const electronGeometry = new THREE.BufferGeometry();
    electronGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(electronPositions, 3)
    );
    electronGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(electronColors, 3)
    );
    electronGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(electronSizes, 1)
    );

    const electronMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const electrons = new THREE.Points(electronGeometry, electronMaterial);
    scene.add(electrons);

    // === Hole particles in valence band ===
    const holeCount = 100;
    const holePositions = new Float32Array(holeCount * 3);
    const holeColors = new Float32Array(holeCount * 3);

    for (let i = 0; i < holeCount; i++) {
      const k = (Math.random() - 0.5) * 3;
      const E = -0.3 * k * k + (Math.random() - 0.5) * 0.2;
      const z = (Math.random() - 0.5) * 2;

      holePositions[i * 3] = k;
      holePositions[i * 3 + 1] = E;
      holePositions[i * 3 + 2] = z;

      // Blue color for holes
      holeColors[i * 3] = 0.3;
      holeColors[i * 3 + 1] = 0.3;
      holeColors[i * 3 + 2] = 1;
    }

    const holeGeometry = new THREE.BufferGeometry();
    holeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(holePositions, 3)
    );
    holeGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(holeColors, 3)
    );

    const holeMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const holes = new THREE.Points(holeGeometry, holeMaterial);
    scene.add(holes);

    // === Coherence visualization (oscillating line between bands) ===
    const coherenceGeometry = new THREE.BufferGeometry();
    const coherencePoints: number[] = [];
    for (let i = 0; i < 50; i++) {
      const t = i / 49;
      const y = t * 1.5;
      coherencePoints.push(0, y, 0);
    }
    coherenceGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(coherencePoints, 3)
    );
    const coherenceMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.6,
    });
    const coherence = new THREE.Line(coherenceGeometry, coherenceMaterial);
    scene.add(coherence);

    // === Axes ===
    // k-axis
    const kAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.5, 0, 0),
      new THREE.Vector3(2.5, 0, 0),
    ]);
    const kAxis = new THREE.Line(
      kAxisGeometry,
      new THREE.LineBasicMaterial({ color: 0x444444 })
    );
    scene.add(kAxis);

    // E-axis
    const eAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 2.5, 0),
    ]);
    const eAxis = new THREE.Line(
      eAxisGeometry,
      new THREE.LineBasicMaterial({ color: 0x444444 })
    );
    scene.add(eAxis);

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      animationId: 0,
      time: 0,
      electrons,
      holes,
      coherence,
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
    const animate = () => {
      if (!sceneRef.current) return;
      sceneRef.current.animationId = requestAnimationFrame(animate);

      const { scene, camera, renderer, controls, electrons, holes, coherence } =
        sceneRef.current;

      if (animating) {
        sceneRef.current.time += 0.02;

        // Animate electrons (thermal motion + drift)
        const ePositions = electrons.geometry.attributes.position
          .array as Float32Array;
        for (let i = 0; i < electronCount; i++) {
          ePositions[i * 3] += (Math.random() - 0.5) * 0.02;
          ePositions[i * 3 + 1] += (Math.random() - 0.5) * 0.01;
          ePositions[i * 3 + 2] += (Math.random() - 0.5) * 0.02;

          // Keep within bounds
          if (Math.abs(ePositions[i * 3]) > 2) ePositions[i * 3] *= 0.9;
          const k = ePositions[i * 3];
          const minE = 1.5 + 0.3 * k * k - 0.2;
          if (ePositions[i * 3 + 1] < minE) ePositions[i * 3 + 1] = minE;
        }
        electrons.geometry.attributes.position.needsUpdate = true;

        // Animate holes
        const hPositions = holes.geometry.attributes.position
          .array as Float32Array;
        for (let i = 0; i < holeCount; i++) {
          hPositions[i * 3] += (Math.random() - 0.5) * 0.02;
          hPositions[i * 3 + 1] += (Math.random() - 0.5) * 0.01;
          hPositions[i * 3 + 2] += (Math.random() - 0.5) * 0.02;

          // Keep within bounds
          if (Math.abs(hPositions[i * 3]) > 2) hPositions[i * 3] *= 0.9;
          const k = hPositions[i * 3];
          const maxE = -0.3 * k * k + 0.2;
          if (hPositions[i * 3 + 1] > maxE) hPositions[i * 3 + 1] = maxE;
        }
        holes.geometry.attributes.position.needsUpdate = true;

        // Animate coherence (oscillating)
        const cPositions = coherence.geometry.attributes.position
          .array as Float32Array;
        for (let i = 0; i < 50; i++) {
          const t = i / 49;
          const x = Math.sin(sceneRef.current.time * 5 + t * 10) * 0.2 * (1 - Math.abs(t - 0.5) * 2);
          cPositions[i * 3] = x;
        }
        coherence.geometry.attributes.position.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
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
  }, [animating]);

  // Update particle count based on excitation
  useEffect(() => {
    if (!sceneRef.current) return;

    const { electrons, holes } = sceneRef.current;

    // Adjust opacity based on excitation level
    (electrons.material as THREE.PointsMaterial).opacity = 0.3 + excitation * 0.7;
    (holes.material as THREE.PointsMaterial).opacity = 0.3 + excitation * 0.7;
  }, [excitation]);

  return (
    <section id="sbe-viz" className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Semiconductor Bloch Equations in 3D
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Visualize quantum carrier dynamics: electrons (red) and holes (blue) in their energy bands,
            connected by quantum coherence (green).
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-4">
          {/* 3D Viewer */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden border border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>Electrons (red)</span>
                  <span>Holes (blue)</span>
                  <span>Coherence (green)</span>
                </div>
                <button
                  onClick={() => setAnimating(!animating)}
                  className="px-2 py-1 text-xs text-zinc-500 hover:text-white"
                >
                  {animating ? "Pause" : "Play"}
                </button>
              </div>
              <div
                ref={containerRef}
                className="h-[500px] w-full cursor-grab active:cursor-grabbing"
              />
            </div>
            <p className="mt-3 text-center text-sm text-zinc-500">
              Drag to rotate • Scroll to zoom • Energy bands show parabolic dispersion E(k)
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-6 border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="text-sm font-medium text-zinc-300">SBE Parameters</h3>

            {/* Excitation */}
            <div>
              <label className="flex items-center justify-between text-sm text-zinc-400">
                <span>Excitation Level</span>
                <span className="font-mono font-semibold text-white">{(excitation * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={excitation}
                onChange={(e) => setExcitation(Number(e.target.value))}
                className="mt-2 w-full accent-red-500"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="flex items-center justify-between text-sm text-zinc-400">
                <span>Temperature</span>
                <span className="font-mono font-semibold text-white">{temperature} K</span>
              </label>
              <input
                type="range"
                min="77"
                max="500"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="mt-2 w-full accent-red-500"
              />
            </div>

            {/* Info */}
            <div className="border-t border-zinc-800 pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Physics
              </h4>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Band Gap</dt>
                  <dd className="font-mono text-white">1.42 eV</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Dephasing T₂</dt>
                  <dd className="font-mono text-white">50 fs</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Relaxation T₁</dt>
                  <dd className="font-mono text-white">1 ps</dd>
                </div>
              </dl>
            </div>

            {/* Legend */}
            <div className="border-t border-zinc-800 pt-4">
              <h4 className="text-xs uppercase tracking-wide text-zinc-600">
                Legend
              </h4>
              <ul className="mt-3 space-y-1 text-xs text-zinc-500">
                <li>Electrons in conduction band</li>
                <li>Holes in valence band</li>
                <li>Quantum coherence (polarization)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
