import { site } from "@/content/site";
import { asset } from "@/lib/assets";

/**
 * Footer. Light palette to match the rest of the site.
 */
export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2">
              <img
                src={asset("pulsesuite-logo.png")}
                alt={`${site.name} logo`}
                className="h-7 w-auto"
              />
              <span className="text-base font-semibold text-zinc-900">
                {site.name}
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">
              {site.footer.blurb}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-zinc-500">
              {site.footer.tagline}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Links
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={site.links.docs}
                  className="text-zinc-700 hover:text-zinc-950"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href={site.links.github}
                  className="text-zinc-700 hover:text-zinc-950"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={site.links.paper}
                  className="text-zinc-700 hover:text-zinc-950"
                >
                  Research lineage
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
          {site.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
