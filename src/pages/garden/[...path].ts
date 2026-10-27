import type { APIRoute } from "astro";

/**
 * /garden moved to /notes. On demand, not prerendered: only a real 301 tells
 * search engines the move is permanent.
 */
export const prerender = false;

export const GET: APIRoute = ({ params, url, redirect }) => {
    const rest = params.path ? `/${params.path}` : "";
    return redirect(`/notes${rest}${url.search}`, 301);
};
