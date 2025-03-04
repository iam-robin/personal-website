import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';

export async function GET(context) {
    const photoItems = await getCollection('365');

    return rss({
        title: 'iamrobin 365 Project',
        description: 'A photo a day for a year',
        site: context.site,
        xmlns: {
            media: 'http://search.yahoo.com/mrss/'
        },
        stylesheet: '/rss/styles.xsl',
        items: photoItems.map((item) => ({
            title: item.data.day,
            pubDate: item.data.date,
            description: item.data.description,
            link: context.site + '365/' + item.data.day,
            content: sanitizeHtml(
                '<img src="' +
                    context.site +
                    item.data.image.src +
                    '" alt="' +
                    'Photo from' +
                    item.data.day +
                    '">' +
                    (item.data.description ? '<p>' + item.data.description + '</p>\n' : ''),
                {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
                }
            ),
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
