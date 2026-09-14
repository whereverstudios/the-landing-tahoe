/**
 * Prefix internal paths with the configured `base` (GitHub Pages serves the site
 * from /the-landing-tahoe/). External links, tel:, mailto: and #anchors pass through.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function url(path: string = "/"): string {
  if (/^(https?:\/\/|mailto:|tel:|sms:|#)/i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function isCurrent(pathname: string, path: string): boolean {
  const norm = (s: string) => (s.endsWith("/") ? s : `${s}/`);
  return norm(pathname) === norm(url(path));
}
