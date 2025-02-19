import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const photoItems = await getCollection('365');

    return rss({
        title: 'iamrobin 365 Project',
        description: 'A photo a day for a year',
        site: context.site,
        xmlns: {
            media: 'http://search.yahoo.com/mrss/'
        },
        items: photoItems.map((item) => ({
            title: item.data.title,
            pubDate: item.data.pubDate,
            description: item.data.description,
            customData: `<media:content
            type="image/jpeg"
            width="200"
            height="600"
            medium="image"
            url="${context.site + item.data.image}" />
        `
        })),
        customData: `<language>en-us</language>`
    });
}
