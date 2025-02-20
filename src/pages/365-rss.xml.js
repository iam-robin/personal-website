import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const photoItems = await getCollection('365');
    console.log('🚀 ~ GET ~ photoItems:', photoItems[0].data.image);

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
            width="${item.data.image.width}"
            height="${item.data.image.height}"
            medium="image"
            url="${context.site + item.data.image.src}" />
        `
        })),
        customData: `<language>en-us</language>`
    });
}
