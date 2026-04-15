import { site } from "@/content/site";

/**
 * Final call-to-action banner. Drives demo requests for commercial positioning.
 */
export function CTA() {
  return (
    <section id="contact" className="border-t border-zinc-200 bg-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {site.cta.headline}
        </h2>
        <p className="mt-4 text-lg text-zinc-400">
          {site.cta.subhead}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`mailto:${site.contact.email}?subject=PulseSuite Demo Request`}
            className="inline-flex h-11 items-center justify-center bg-white px-8 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
          >
            {site.cta.primaryCta.label}
          </a>
          <a
            href="#technology"
            className="inline-flex h-11 items-center justify-center border border-zinc-700 px-6 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            Learn the Technology
          </a>
        </div>
      </div>
    </section>
  );
}
