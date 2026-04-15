import { site } from "@/content/site";

/**
 * Six-up feature grid. Each card pulled from site.features.
 * Add or remove items in src/content/site.ts — no JSX edits needed.
 */
export function Features() {
  return (
    <section id="features" className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            The Complete Ultrafast Photonics Platform
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Other tools solve electromagnetics <em>or</em> quantum physics.
            PulseSuite solves both self-consistently, at every timestep.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {site.features.map((f) => (
            <div
              key={f.title}
              className="border-l border-zinc-300 pl-6"
            >
              <h3 className="text-base font-medium text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
