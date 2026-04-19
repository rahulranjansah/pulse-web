import { site } from "@/content/site";
import { asset } from "@/lib/assets";

/**
 * Top navigation bar. Sticky, light, minimal.
 * Nav items come from `site.nav` — edit that list to add/remove links.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="./" className="flex items-center gap-2">
          <img
            src={asset("pulsesuite-logo.png")}
            alt={`${site.name} logo`}
            className="h-8 w-auto"
          />
          <span className="text-base font-semibold tracking-tight text-zinc-900">
            {site.name}
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm text-zinc-600 sm:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-zinc-950"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
