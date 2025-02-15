import rss from '@astrojs/rss';
import { createDayArray, getDayOfYear } from 'src/utils/365-helpers';

export async function GET(context) {
    const today = new Date();
    const days = createDayArray(getDayOfYear(today));

    const photos = Object.values(import.meta.glob('../assets/365/*', { eager: true }));

    const items = days.map((day) => {
        const photo = photos.find((photo) => {
            const filename = photo.default.src.split('/').pop() || '';
            return filename.startsWith(day);
        });

        return {
            title: `${day}`,
            description: `Photo taken on ${day}`,
            pubDate: new Date(day),
            link: `/365/${day}`
        };
    });

    return rss({
        title: 'iamrobin 365 Project',
        description: 'A photo a day for a year',
        site: context.site,
        items: items,
        customData: `<language>en-us</language>`
    });
}
