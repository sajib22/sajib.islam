/**
 * Worker entry point for sajibislam.com
 *
 * Right now this does exactly one thing: hand every request to the static
 * files in /public. That is deliberate — it means adding a dynamic feature
 * later is a few lines added to this file, not a change to the hosting setup
 * or to wrangler.jsonc.
 *
 * To add a route later (see ROADMAP.md), branch before the fallthrough:
 *
 *   const url = new URL(request.url);
 *   if (url.pathname === "/api/contact") return handleContact(request, env);
 *
 * Everything that is not an explicit route keeps falling through to the
 * static site.
 */
export default {
  async fetch(request, env) {
    // ── Future routes go here, above the fallthrough. ──

    return env.ASSETS.fetch(request);
  },
};
