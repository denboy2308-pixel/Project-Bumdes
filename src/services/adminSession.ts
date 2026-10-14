import { AdminUser, MetaSEOSettings } from '../types/admin';

export const STORAGE_ADMIN_KEY = 'bumdes_admin_session';

/**
 * Get current authenticated admin session from localStorage without loading Firebase SDK
 */
export function getCurrentAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_ADMIN_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

/**
 * Apply Meta SEO to HTML head dynamically without heavy Firebase dependencies
 */
export function applyMetaSEOTags(seo: MetaSEOSettings) {
  if (typeof document === 'undefined') return;

  // Title
  document.title = seo.siteTitle;

  // Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', seo.metaDescription);

  // Meta Keywords
  let kwMeta = document.querySelector('meta[name="keywords"]');
  if (!kwMeta) {
    kwMeta = document.createElement('meta');
    kwMeta.setAttribute('name', 'keywords');
    document.head.appendChild(kwMeta);
  }
  kwMeta.setAttribute('content', seo.metaKeywords);

  // Robots
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }
  robotsMeta.setAttribute('content', seo.robotsIndexing);

  // Open Graph Title
  let ogTitleMeta = document.querySelector('meta[property="og:title"]');
  if (!ogTitleMeta) {
    ogTitleMeta = document.createElement('meta');
    ogTitleMeta.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitleMeta);
  }
  ogTitleMeta.setAttribute('content', seo.ogTitle || seo.siteTitle);

  // Open Graph Description
  let ogDescMeta = document.querySelector('meta[property="og:description"]');
  if (!ogDescMeta) {
    ogDescMeta = document.createElement('meta');
    ogDescMeta.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescMeta);
  }
  ogDescMeta.setAttribute('content', seo.ogDescription || seo.metaDescription);

  // Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', seo.canonicalUrl);
}

export const applyMetaSEOSettingsToDOM = applyMetaSEOTags;
