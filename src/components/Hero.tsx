import { site } from "@/content/site";
import { asset } from "@/lib/assets";
import { WaveBackground } from "./WaveBackground";

/**
 * Hero section: eyebrow tag, headline, subhead, dual CTAs, stats bar.
 * Animated wave background with enterprise scientific software aesthetic.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Animated wave background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <WaveBackground />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Technical descriptor line */}
          <p className="mb-6 text-sm tracking-wide text-zinc-500 uppercase">
            Quantum-coherent dynamics · 3D PSTD Maxwell solver · Semiconductor Bloch equations
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
            {site.hero.headline}
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 sm:text-xl">
            {site.hero.subhead}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={site.hero.primaryCta.href}
              className="inline-flex h-11 items-center justify-center bg-zinc-900 px-8 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              {site.hero.primaryCta.label}
            </a>
            <a
              href={site.hero.secondaryCta.href}
              className="inline-flex h-11 items-center justify-center border border-zinc-300 px-6 text-sm text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            >
              {site.hero.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {site.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-zinc-900 sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-zinc-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* hero visual: the pulse waveform logo as a centerpiece */}
        <div className="mt-16 flex justify-center">
          <img
            src={asset("pulsesuite-logo.png")}
            alt="PulseSuite ultrafast pulse visualization"
            className="h-auto w-full max-w-3xl"
          />
        </div>
      </div>
    </section>
  );
}
