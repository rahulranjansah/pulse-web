import { useEffect, useRef } from "react";

/**
 * Animated wave background using Canvas.
 * Shows a propagating Gaussian pulse with subtle chirp effect.
 * Lightweight alternative to Three.js for performance.
 */
export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;

      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(1, "rgba(250, 250, 252, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const centerY = height * 0.5;
      const amplitude = height * 0.15;

      // Draw multiple wave layers for depth
      const waves = [
        { color: "rgba(220, 38, 38, 0.08)", speed: 0.5, freq: 1.0, phase: 0 },
        { color: "rgba(220, 38, 38, 0.12)", speed: 0.7, freq: 1.2, phase: 2 },
        { color: "rgba(220, 38, 38, 0.06)", speed: 0.3, freq: 0.8, phase: 4 },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 2) {
          // Normalized position
          const nx = x / width;

          // Traveling Gaussian envelope
          const pulseCenter = ((time * wave.speed * 0.02) % 2) - 0.5;
          const envelope = Math.exp(-Math.pow((nx - pulseCenter) * 4, 2));

          // Chirped carrier wave (frequency increases with position)
          const chirp = 1 + nx * 0.5;
          const carrier = Math.sin(
            (nx * 20 * wave.freq + time * wave.speed * 0.05 + wave.phase) * chirp
          );

          // Combined waveform
          const y = centerY + envelope * carrier * amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      // Draw main pulse wave (more visible)
      ctx.beginPath();
      ctx.moveTo(0, centerY);

      for (let x = 0; x <= width; x += 1) {
        const nx = x / width;

        // Traveling pulse
        const pulseCenter = ((time * 0.015) % 1.5) - 0.25;
        const envelope = Math.exp(-Math.pow((nx - pulseCenter) * 5, 2));

        // Chirped oscillation
        const chirpRate = 0.3;
        const phase = nx * 25 + chirpRate * nx * nx * 50 - time * 0.08;
        const carrier = Math.sin(phase);

        const y = centerY + envelope * carrier * amplitude * 0.8;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(220, 38, 38, 0.25)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw envelope outline
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const nx = x / width;
        const pulseCenter = ((time * 0.015) % 1.5) - 0.25;
        const envelope = Math.exp(-Math.pow((nx - pulseCenter) * 5, 2));
        const y = centerY - envelope * amplitude * 0.8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(220, 38, 38, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Lower envelope
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const nx = x / width;
        const pulseCenter = ((time * 0.015) % 1.5) - 0.25;
        const envelope = Math.exp(-Math.pow((nx - pulseCenter) * 5, 2));
        const y = centerY + envelope * amplitude * 0.8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(220, 38, 38, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      time += 1;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.7 }}
    />
  );
}
