/**
 * Lightweight SPA Path Router Utility
 * Synchronizes browser location pathnames seamlessly.
 */

export function navigate(path: string) {
  window.history.pushState(null, '', path);
  // Dispatch a global event to notify components of the route change
  window.dispatchEvent(new Event('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
