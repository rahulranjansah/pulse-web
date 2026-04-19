import { site } from "@/content/site";

/**
 * Closing CTA. Docs-first for v1 — GTM Phase 1 targets academic/lab users
 * who expect to read documentation before committing to a tool.
 */
export function CTA() {
  return (
    <section id="get-started" className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          {site.cta.headline}
        </h2>
        <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg">
          {site.cta.subhead}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={site.links.docs}
            className="inline-flex h-11 items-center justify-center bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Read the Docs
          </a>
          <a
            href={site.links.github}
            className="inline-flex h-11 items-center justify-center border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-900 transition hover:border-zinc-400"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
