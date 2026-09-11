/**
 * Central site-wide constants used for SEO metadata (canonical URLs, Open
 * Graph tags, JSON-LD, sitemap, robots.txt). Change the domain here once
 * and it propagates everywhere metadata is generated.
 */
export const SITE_URL = "https://www.ffg-ev.de";
export const SITE_NAME = "FFG-VE Horizon";
export const SITE_LOCALE = "de_DE";
export const SITE_DESCRIPTION =
  "FFG-VE Horizon ist eine internationale humanitäre NGO für Bildung, Gesundheit und nachhaltige Entwicklung. Unterstützen Sie unsere Programme durch Spenden oder ehrenamtliches Engagement.";

/** Builds an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}
