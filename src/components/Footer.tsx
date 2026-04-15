import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div>
            <p className="text-lg font-semibold text-white">{site.name}</p>
            <p className="mt-1 text-sm text-zinc-400">{site.footer.tagline}</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#use-cases" className="hover:text-white">
              Use Cases
            </a>
            <a href={site.links.docs} className="hover:text-white">
              Docs
            </a>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-800 pt-8 text-center">
          <p className="text-sm text-zinc-500">{site.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
