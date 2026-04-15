/**
 * Helper for referencing files in /public so they work both locally
 * and when deployed under a basePath like /pulse-web/ on GitHub Pages.
 *
 * Vite injects `import.meta.env.BASE_URL` based on the `base` config in
 * vite.config.ts (which itself reads BASE_PATH at build time).
 *
 * Usage:
 *   <img src={asset("pulsesuite-logo.png")} />
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${clean}`;
}
