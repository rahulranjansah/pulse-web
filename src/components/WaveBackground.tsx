import { useEffect, useRef } from "react";

/**
 * Animated wave background for the hero.
 *
 * Renders a soft, slowly-drifting ensemble of Gaussian-enveloped sinusoidal
 * pulses into a `<canvas>`. Intended to sit BEHIND the pulse-waveform logo:
 * the logo is the sharp red hero visual; this layer is the ambient motion
 * that gives the hero a sense of "something is happening in here".
 *
 * Design constraints (all intentional):
 *   - Pure Canvas 2D. No WebGL, no Three.js — keeps the bundle <200KB.
 *   - Low opacity + soft colors — must not compete with the logo.
 *   - Respects `prefers-reduced-motion` — renders a single static frame
 *     if the user has motion disabled.
 *   - Pauses when the tab is not visible (saves battery on laptops).
 *   - Resizes with the container via ResizeObserver.
 *
 * To tweak the look, edit the constants at the top of the component
 * (PULSE_COUNT, colors, speeds, envelope width). Everything is intentionally
 * simple — no parameters, no context dependency.
 */
export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ---- Tunable constants (edit these to adjust the vibe) -----------------
    // How many overlapping pulses are drifting at once.
    const PULSE_COUNT = 5;
    // Visual color of the pulses. Soft zinc, low alpha — must not fight the logo.
    const STROKE_COLOR = "rgba(113, 113, 122, 0.28)"; // zinc-500 at ~28% alpha
    // Color of the baseline guideline (the horizontal axis).
    const GUIDE_COLOR = "rgba(228, 228, 231, 0.6)"; // zinc-200 at 60% alpha
    // How wide (in CSS pixels) each pulse's envelope is.
    const ENVELOPE_SIGMA = 90;
    // Pulse amplitude in CSS pixels.
    const AMPLITUDE = 40;
    // Carrier frequency (radians per pixel). Higher = more wiggles per pulse.
    const CARRIER_K = 0.22;
    // Drift speed range in CSS pixels per second.
    const SPEED_MIN = 35;
    const SPEED_MAX = 90;
    // Line thickness.
    const LINE_WIDTH = 1.4;
    // -----------------------------------------------------------------------

    // Per-pulse state. Each has a position, speed, and phase offset.
    type Pulse = {
      x: number;
      speed: number;
      phase: number;
      yOffset: number; // vertical offset, so pulses don't all stack on one line
    };

    const randRange = (min: number, max: number) => min + Math.random() * (max - min);

    const createPulses = (width: number, height: number): Pulse[] =>
      Array.from({ length: PULSE_COUNT }, (_, i) => ({
        // Start staggered across the canvas so we aren't empty for 5 seconds.
        x: (i / PULSE_COUNT) * width + randRange(-50, 50),
        speed: randRange(SPEED_MIN, SPEED_MAX),
        phase: randRange(0, Math.PI * 2),
        yOffset: randRange(-height * 0.18, height * 0.18),
      }));

    let pulses: Pulse[] = [];
    let rafId = 0;
    let lastTime = performance.now();
    let paused = false;

    // Handle HiDPI screens: render at device pixel ratio, scale back via CSS.
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pulses = createPulses(rect.width, rect.height);
    };

    setCanvasSize();

    const drawFrame = (now: number) => {
      const dtSeconds = Math.min(0.05, (now - lastTime) / 1000); // clamp for tab-switch spikes
      lastTime = now;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Baseline guide — the "equilibrium" axis of the pulses.
      ctx.strokeStyle = GUIDE_COLOR;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      ctx.strokeStyle = STROKE_COLOR;
      ctx.lineWidth = LINE_WIDTH;

      for (const p of pulses) {
        p.x += p.speed * dtSeconds;
        // Wrap around once the pulse has drifted well off the right edge.
        if (p.x - ENVELOPE_SIGMA * 3 > width) {
          p.x = -ENVELOPE_SIGMA * 3;
          p.yOffset = randRange(-height * 0.18, height * 0.18);
          p.speed = randRange(SPEED_MIN, SPEED_MAX);
          p.phase = randRange(0, Math.PI * 2);
        }

        // Draw one Gaussian-enveloped sinusoid.
        ctx.beginPath();
        const drawStart = Math.max(0, p.x - ENVELOPE_SIGMA * 3);
        const drawEnd = Math.min(width, p.x + ENVELOPE_SIGMA * 3);
        const step = 2; // px between sampled points; smaller = smoother but slower
        for (let sx = drawStart; sx <= drawEnd; sx += step) {
          const dx = sx - p.x;
          const envelope = Math.exp(-(dx * dx) / (2 * ENVELOPE_SIGMA * ENVELOPE_SIGMA));
          const carrier = Math.sin(CARRIER_K * dx + p.phase);
          const y = centerY + p.yOffset + AMPLITUDE * envelope * carrier;
          if (sx === drawStart) ctx.moveTo(sx, y);
          else ctx.lineTo(sx, y);
        }
        ctx.stroke();
      }

      if (!paused) rafId = requestAnimationFrame(drawFrame);
    };

    // If user prefers reduced motion, render exactly ONE static frame and stop.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      drawFrame(performance.now());
      return;
    }

    lastTime = performance.now();
    rafId = requestAnimationFrame(drawFrame);

    // Pause when the tab is hidden — saves battery on laptops.
    const onVisibility = () => {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(rafId);
      } else if (paused) {
        paused = false;
        lastTime = performance.now();
        rafId = requestAnimationFrame(drawFrame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Resize observer: the hero grows/shrinks as the window does.
    const ro = new ResizeObserver(() => setCanvasSize());
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // `block` + `h-full w-full` makes the canvas fill its positioned parent.
      className="block h-full w-full"
    />
  );
}
