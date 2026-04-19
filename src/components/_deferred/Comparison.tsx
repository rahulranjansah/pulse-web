import { site } from "@/content/site";

/**
 * Competitive comparison section showing PulseSuite's unique value.
 */
export function Comparison() {
  return (
    <section className="border-t border-zinc-200 bg-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {site.comparison.headline}
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            {site.comparison.description}
          </p>
        </div>

        <div className="mt-16 border border-zinc-700">
          {/* Header */}
          <div className="grid grid-cols-2 border-b border-zinc-700 bg-zinc-800/50">
            <div className="border-r border-zinc-700 px-6 py-3 text-xs uppercase tracking-wide text-zinc-500">
              Tool
            </div>
            <div className="px-6 py-3 text-xs uppercase tracking-wide text-zinc-500">
              Limitation
            </div>
          </div>

          {/* Competitor rows */}
          {site.comparison.competitors.map((competitor, index) => (
            <div
              key={competitor.name}
              className={`grid grid-cols-2 ${
                index < site.comparison.competitors.length - 1
                  ? "border-b border-zinc-800"
                  : ""
              }`}
            >
              <div className="border-r border-zinc-800 px-6 py-4 text-sm text-zinc-400">
                {competitor.name}
              </div>
              <div className="px-6 py-4 text-sm text-zinc-500">
                {competitor.limitation}
              </div>
            </div>
          ))}

          {/* PulseSuite row */}
          <div className="grid grid-cols-2 border-t border-zinc-600">
            <div className="border-r border-zinc-700 px-6 py-4 text-sm font-medium text-zinc-200">
              PulseSuite
            </div>
            <div className="px-6 py-4 text-sm text-zinc-300">
              {site.comparison.pulsesuite}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
