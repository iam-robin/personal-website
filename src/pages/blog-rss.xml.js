import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export async function GET(context) {
    const blogPosts = await getCollection("blog");

    const sortedPosts = [...blogPosts].sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime(),
    );

    const lastUpdated =
        sortedPosts.length > 0 ? sortedPosts[0].data.date : new Date();

    return rss({
        title: "iamrobin - Blog",
        description: "Blog posts from Robin's personal website",
        site: context.site,
        xmlns: {
            atom: "http://www.w3.org/2005/Atom",
        },
        items: await Promise.all(
            sortedPosts.map(async (post) => {
                const rawHtml = await marked(post.body);
                const htmlContent = DOMPurify.sanitize(rawHtml);

                return {
                    title: post.data.title,
                    pubDate: post.data.date,
                    description: post.data.description || "",
                    link: `/blog/${post.slug}/`,
                    content: htmlContent,
                };
            }),
        ),
        customData: `<language>en-us</language>
<managingEditor>hey@iamrob.in (Robin Spielmann)</managingEditor>
<lastBuildDate>${lastUpdated.toUTCString()}</lastBuildDate>
<atom:link href="${new URL("blog-rss.xml", context.site).href}" rel="self" type="application/rss+xml" />`,
    });
}
