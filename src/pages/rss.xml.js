import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
    return rss({
        title: 'Astro Learner | Blog',
        description: 'My journey learning Astro',
        site: context.site,
        items: [
            {
                title: 'First Post',
                description: 'This is my first post'
            },
            {
                title: 'Second Post',
                description: 'This is my second post'
            }
        ],
        customData: `<language>en-us</language>`
    });
}
