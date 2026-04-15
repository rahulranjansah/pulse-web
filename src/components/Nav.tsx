import { site } from "@/content/site";
import { asset } from "@/lib/assets";

/**
 * Top navigation bar.
 * Sticky, white background with subtle bottom border for the scientific/enterprise feel.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="./" className="flex items-center gap-2">
          <img
            src={asset("pulsesuite-logo.png")}
            alt={`${site.name} logo`}
            className="h-9 w-auto"
          />
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            {site.name}
          </span>
        </a>

        <div className="hidden items-center gap-6 text-sm font-medium text-zinc-700 sm:flex">
          <a href="#features" className="hover:text-zinc-950">
            Features
          </a>
          <a href="#technology" className="hover:text-zinc-950">
            Technology
          </a>
          <a href="#demo" className="hover:text-zinc-950">
            Demo
          </a>
          <a href="#use-cases" className="hover:text-zinc-950">
            Applications
          </a>
          <a
            href="#contact"
            className="bg-zinc-900 px-4 py-2 text-white transition hover:bg-zinc-700"
          >
            Request Demo
          </a>
        </div>
      </nav>
    </header>
  );
}
