import { site } from "@/content/site";

/**
 * Three differentiators. Data pulled from `site.differentiators`.
 *
 * Intentionally three — not six — so each one lands. Add/remove items
 * in src/content/site.ts; this component will render whatever length it gets.
 */
export function Features() {
  return (
    <section id="differentiators" className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
            What it is
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            A coupled-physics solver, not a stitched pipeline.
          </h2>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {site.differentiators.map((d, i) => (
            <div key={d.title} className="border-l border-zinc-300 pl-6">
              <p className="text-xs font-mono text-zinc-400">
                0{i + 1}
              </p>
              <h3 className="mt-3 text-base font-semibold text-zinc-900">
                {d.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
