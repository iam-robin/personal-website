import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getBookmarks } from "../utils/bookmarks";

export async function GET(context: APIContext) {
    const bookmarks = await getBookmarks();

    const lastUpdated =
        bookmarks.length > 0 ? new Date(bookmarks[0].data.added) : new Date();

    return rss({
        title: "iamrobin — Bookmarks",
        description: "Curated bookmarks from Robin's collection",
        site: context.site!,
        xmlns: { atom: "http://www.w3.org/2005/Atom" },
        items: bookmarks.map((bookmark) => ({
            title: bookmark.data.title,
            pubDate: new Date(bookmark.data.added),
            link: bookmark.data.url,
            description:
                bookmark.data.tags.length > 0
                    ? `Tags: ${bookmark.data.tags.join(", ")}`
                    : "",
        })),
        customData: `<language>en-us</language>
<managingEditor>hey@iamrob.in (Robin Spielmann)</managingEditor>
<lastBuildDate>${lastUpdated.toUTCString()}</lastBuildDate>
<atom:link href="${new URL("bookmarks-rss.xml", context.site).href}" rel="self" type="application/rss+xml" />`,
    });
}
