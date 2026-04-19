import { site } from "@/content/site";
import { asset } from "@/lib/assets";
import { WaveBackground } from "@/components/WaveBackground";

/**
 * Hero section.
 *
 * Layered structure (bottom to top in z-index order):
 *   1. Animated canvas (WaveBackground) — drifting Gaussian pulses
 *   2. Radial white fade gradient — keeps the headline area readable
 *   3. Static pulse logo — the sharp focal point
 *   4. Headline / subhead / CTAs — pinned above everything else
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Layer 1: animated canvas. Fills the whole hero, sits behind everything. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <WaveBackground />
      </div>

      {/* Layer 2: soft radial fade. Lets the background show at the edges
          but fades to solid white in the center so headline stays readable. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.92)_0%,_rgba(255,255,255,0.72)_45%,_rgba(255,255,255,0)_75%)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* <p className="mb-6 inline-block border border-zinc-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
            {site.hero.eyebrow}
          </p> */}

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            {site.hero.headline}
          </h1>

          <p className="mt-6 text-pretty text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            {site.hero.subhead}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={site.hero.primaryCta.href}
              className="inline-flex h-11 items-center justify-center bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              {site.hero.primaryCta.label}
            </a>
            <a
              href={site.hero.secondaryCta.href}
              className="inline-flex h-11 items-center justify-center border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-900 transition hover:border-zinc-400"
            >
              {site.hero.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* Layer 3: the pulse logo as the hero visual. The red waveform sits
            on top of the animated zinc-gray waves in the background — the
            brand asset is the "measured" pulse, the bg is the "ambient" motion. */}
        <div className="mt-20 flex justify-center">
          <img
            src={asset("pulsesuite-logo.png")}
            alt="PulseSuite pulse waveform"
            className="relative h-auto w-full max-w-2xl opacity-95"
          />
        </div>
      </div>
    </section>
  );
}
