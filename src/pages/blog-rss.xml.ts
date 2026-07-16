import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    const posts = (await getCollection("blog")).sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime(),
    );

    const lastUpdated = posts.length > 0 ? posts[0].data.date : new Date();

    return rss({
        title: "iamrobin — Blog",
        description: "Blog posts from Robin's personal website",
        site: context.site!,
        xmlns: { atom: "http://www.w3.org/2005/Atom" },
        items: await Promise.all(
            posts.map(async (post) => ({
                title: post.data.title,
                pubDate: post.data.date,
                description: post.data.description || "",
                link: `/blog/${post.id}/`,
                content: DOMPurify.sanitize(await marked.parse(post.body ?? "")),
            })),
        ),
        customData: `<language>en-us</language>
<managingEditor>hey@iamrob.in (Robin Spielmann)</managingEditor>
<lastBuildDate>${lastUpdated.toUTCString()}</lastBuildDate>
<atom:link href="${new URL("blog-rss.xml", context.site).href}" rel="self" type="application/rss+xml" />`,
    });
}
