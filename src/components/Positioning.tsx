import { site } from "@/content/site";

/**
 * "Where PulseSuite fits / where it doesn't" — the honest-positioning section.
 *
 * Rendering both the good-fit list AND the not-the-right-tool list in the
 * same section is a deliberate trust signal: teams building serious software
 * know what their tool is NOT for. This mirrors the Silicon Catalyst
 * application's narrow positioning.
 */
export function Positioning() {
  const { headline, lede, goodFit, badFit } = site.positioning;

  return (
    <section id="positioning" className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
            Where it fits
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg">
            {lede}
          </p>
        </div>

        <div className="mt-14 grid gap-10 border border-zinc-200 bg-zinc-50 sm:grid-cols-2 sm:divide-x sm:divide-zinc-200 sm:gap-0">
          <FitList
            title={goodFit.title}
            items={goodFit.items}
            accent="text-emerald-700"
            marker=""
          />
          <FitList
            title={badFit.title}
            items={badFit.items}
            accent="text-zinc-400"
            marker=""
          />
        </div>
      </div>
    </section>
  );
}

function FitList({
  title,
  items,
  accent,
  marker,
}: {
  title: string;
  items: readonly string[];
  accent: string;
  marker: string;
}) {
  return (
    <div className="p-8 sm:p-10">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-700">
            <span className={`mt-0.5 font-mono text-xs ${accent}`}>{marker}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
