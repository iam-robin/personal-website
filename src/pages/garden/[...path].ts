import type { APIRoute } from "astro";

/**
 * The section used to live at /garden. Old links, search results and
 * bookmarks still point there, so every /garden/... URL gets a permanent
 * redirect to the same path under /notes. On demand rather than prerendered:
 * a static build can only fake redirects with a meta refresh, and only a real
 * 301 tells search engines the move is for good.
 */
export const prerender = false;

export const GET: APIRoute = ({ params, url, redirect }) => {
    const rest = params.path ? `/${params.path}` : "";
    return redirect(`/notes${rest}${url.search}`, 301);
};
