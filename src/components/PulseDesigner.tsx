import { useState, useEffect, useRef } from "react";

/**
 * Interactive pulse designer component.
 * Users can adjust pulse parameters and see the waveform update in real-time.
 */
export function PulseDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pulse parameters
  const [pulseWidth, setPulseWidth] = useState(30); // fs
  const [chirp, setChirp] = useState(0); // normalized -1 to 1
  const [wavelength, setWavelength] = useState(800); // nm

  // Derived values for display
  const frequency = (299792458 / (wavelength * 1e-9) / 1e12).toFixed(1); // THz
  const bandwidth = (0.44 / (pulseWidth * 1e-15) / 1e12 * Math.sqrt(1 + chirp * chirp)).toFixed(1); // THz

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerY = height / 2;
    const amplitude = height * 0.35;

    // Clear
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 1;

    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Time array (centered on pulse)
    const tMin = -100; // fs
    const tMax = 100;  // fs
    const numPoints = 500;

    // Calculate pulse
    const tau_G = pulseWidth / Math.sqrt(2 * Math.log(2)); // Gaussian parameter
    const omega0 = 2 * Math.PI * 299792458 / (wavelength * 1e-9); // rad/s
    const chirpParam = chirp * 2e28; // Scale chirp to physical units

    const points: { x: number; y: number; env: number }[] = [];

    for (let i = 0; i < numPoints; i++) {
      const t = tMin + (i / numPoints) * (tMax - tMin); // fs
      const t_s = t * 1e-15; // seconds

      // Gaussian envelope
      const envelope = Math.exp(-(t_s * t_s) / ((tau_G * 1e-15) ** 2));

      // Carrier with chirp
      const phase = omega0 * t_s + chirpParam * t_s * t_s;
      const carrier = Math.cos(phase * 1e-13); // Scale for visibility

      const field = envelope * carrier;

      // Map to canvas coordinates
      const x = (i / numPoints) * width;
      const y = centerY - field * amplitude;
      const envY = envelope * amplitude;

      points.push({ x, y, env: envY });
    }

    // Draw envelope (dashed)
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(220, 38, 38, 0.4)";
    ctx.lineWidth = 2;
    points.forEach((p, i) => {
      const y = centerY - p.env;
      if (i === 0) ctx.moveTo(p.x, y);
      else ctx.lineTo(p.x, y);
    });
    ctx.stroke();

    // Lower envelope
    ctx.beginPath();
    points.forEach((p, i) => {
      const y = centerY + p.env;
      if (i === 0) ctx.moveTo(p.x, y);
      else ctx.lineTo(p.x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw main waveform
    ctx.beginPath();
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 2;
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Fill under curve with gradient
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.lineTo(width, centerY);
    ctx.lineTo(0, centerY);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, centerY - amplitude, 0, centerY + amplitude);
    gradient.addColorStop(0, "rgba(220, 38, 38, 0.1)");
    gradient.addColorStop(0.5, "rgba(220, 38, 38, 0.02)");
    gradient.addColorStop(1, "rgba(220, 38, 38, 0.1)");
    ctx.fillStyle = gradient;
    ctx.fill();

    // Axis labels
    ctx.fillStyle = "#71717a";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("-100 fs", 5, height - 5);
    ctx.fillText("0", width / 2 - 5, height - 5);
    ctx.fillText("+100 fs", width - 50, height - 5);
    ctx.fillText("E(t)", 5, 15);

  }, [pulseWidth, chirp, wavelength]);

  return (
    <section id="designer" className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Interactive Pulse Designer
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Adjust parameters and see how chirp affects your ultrafast pulse in real-time.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Controls */}
          <div className="space-y-6 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <h3 className="font-semibold text-zinc-900">Pulse Parameters</h3>

            {/* Pulse Width */}
            <div>
              <label className="flex items-center justify-between text-sm text-zinc-700">
                <span>Pulse Width (FWHM)</span>
                <span className="font-mono text-zinc-900">{pulseWidth} fs</span>
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
                <span className="font-mono text-zinc-900">
                  {chirp === 0 ? "None" : chirp > 0 ? `+${chirp.toFixed(1)}` : chirp.toFixed(1)}
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
              <div className="mt-1 flex justify-between text-xs text-zinc-500">
                <span>Down-chirp</span>
                <span>Up-chirp</span>
              </div>
            </div>

            {/* Wavelength */}
            <div>
              <label className="flex items-center justify-between text-sm text-zinc-700">
                <span>Center Wavelength</span>
                <span className="font-mono text-zinc-900">{wavelength} nm</span>
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
            <div className="border-t border-zinc-200 pt-4">
              <h4 className="text-sm font-medium text-zinc-700">Derived Properties</h4>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Carrier Frequency</dt>
                  <dd className="font-mono text-zinc-900">{frequency} THz</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Bandwidth</dt>
                  <dd className="font-mono text-zinc-900">{bandwidth} THz</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Transform Limited</dt>
                  <dd className="font-mono text-zinc-900">{chirp === 0 ? "Yes" : "No"}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2">
                <span className="text-sm font-medium text-zinc-700">Electric Field E(t)</span>
              </div>
              <canvas
                ref={canvasRef}
                className="h-80 w-full"
                style={{ display: "block" }}
              />
            </div>
            <p className="mt-3 text-center text-sm text-zinc-500">
              {chirp !== 0
                ? "Notice how chirp creates a frequency sweep across the pulse — red shifts to blue (or vice versa)."
                : "Transform-limited pulse: all frequencies arrive at the same time."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
