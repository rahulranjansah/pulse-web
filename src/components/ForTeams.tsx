import { site } from "@/content/site";

/**
 * Slim commercial-signal strip. Sits between CTA and Footer.
 *
 * Two CTAs, different intents:
 *   - Primary (dark button):   "Join the cloud waitlist" → pre-filled mailto
 *     for folks who want to be notified when the hosted product launches.
 *   - Secondary (outlined):    "Commercial inquiry"      → pre-filled mailto
 *     for labs/companies that want to start a specific pilot or services
 *     conversation right now, not just sit on a waitlist.
 *
 * Copy is split into `body` (what the product is) and `audience` (who we're
 * speaking to), pulled from site.forTeams in site.ts.
 */
export function ForTeams() {
  const { eyebrow, headline, body, audience, waitlist, contactEmail, contactLabel } =
    site.forTeams;

  return (
    <section id="for-teams" className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
              {eyebrow}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-zinc-950 sm:text-2xl">
              {headline}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{body}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{audience}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch xl:flex-row">
            <a
              href={waitlist.href}
              className="inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              {waitlist.label}
            </a>
            <a
              href={`mailto:${contactEmail}?subject=PulseSuite%20%E2%80%94%20commercial%20inquiry`}
              className="inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-900 transition hover:border-zinc-400"
            >
              {contactLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
