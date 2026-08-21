/**
 * One link preview card per blog post, built with the site rather than drawn
 * by hand. The route is prerendered, so these are plain PNGs in dist/ — no
 * image is rendered on request.
 *
 * The URL mirrors the post's own: /blog/<id> → /og/blog/<id>.png. A post that
 * wants a hand-made card instead sets `ogImage` in its frontmatter; the page,
 * not this route, decides which one goes in the meta tag.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { categoryLabel } from "../../../utils/blog";
import { renderOgCard } from "../../../utils/og";

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getCollection("blog");
    return posts.map((post) => ({
        params: { slug: post.id },
        props: { post },
    }));
};

export const GET: APIRoute = async ({ props }) => {
    const { post } = props as { post: CollectionEntry<"blog"> };

    const date = post.data.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const category = post.data.category ? categoryLabel(post.data.category) : null;

    const png = await renderOgCard({
        title: post.data.title,
        subtitle: post.data.subtitle,
        meta: [date, category].filter(Boolean).join(" · "),
        pathname: `/blog/${post.id}`,
    });

    // No Cache-Control: the route is prerendered, so the static host sets
    // the headers and this one would only ever apply in dev.
    return new Response(new Uint8Array(png), {
        headers: { "Content-Type": "image/png" },
    });
};
