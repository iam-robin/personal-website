/**
 * Prerendered preview card per post, at /og/blog/<id>.png. A post's own
 * `ogImage` overrides it in the page, not here.
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

    // No Cache-Control: prerendered, so the static host sets the headers.
    return new Response(new Uint8Array(png), {
        headers: { "Content-Type": "image/png" },
    });
};
