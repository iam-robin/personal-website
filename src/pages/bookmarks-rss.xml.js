import rss from "@astrojs/rss";
import { fetchBookmarks } from "../api/raindrop";

export async function GET(context) {
    const bookmarks = await fetchBookmarks(0);

    const lastUpdated =
        bookmarks.length > 0 ? new Date(bookmarks[0].created) : new Date();

    return rss({
        title: "iamrobin - Bookmarks",
        description: "Curated bookmarks from Robin's collection",
        site: context.site,
        xmlns: {
            atom: "http://www.w3.org/2005/Atom",
        },
        items: bookmarks.map((bookmark) => ({
            title: bookmark.title,
            pubDate: new Date(bookmark.created),
            link: bookmark.link,
            description:
                bookmark.tags.length > 0
                    ? `Tags: ${bookmark.tags.join(", ")}`
                    : "",
        })),
        customData: `<language>en-us</language>
<managingEditor>hey@iamrob.in (Robin Spielmann)</managingEditor>
<lastBuildDate>${lastUpdated.toUTCString()}</lastBuildDate>
<atom:link href="${new URL("bookmarks-rss.xml", context.site).href}" rel="self" type="application/rss+xml" />`,
    });
}
