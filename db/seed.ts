import { db, Postcard } from 'astro:db';

export default async function () {
    await db.insert(Postcard).values([
        {
            id: 1,
            author: 'Hannah',
            body: 'Culpa esse officia consequat qui eu quis cillum cillum minim excepteur culpa cillum.',
            date: new Date('2023-10-01'),
            isPublished: true
        },
        {
            id: 2,
            author: 'Bernd',
            body: 'Et culpa ex officia sint velit irure occaecat do proident eu laboris veniam elit.',
            date: new Date('2023-12-20'),
            isPublished: true
        },
        {
            id: 3,
            author: 'Luise',
            body: 'Nostrud amet excepteur deserunt ullamco nisi id aute.',
            date: new Date('2024-04-12'),
            isPublished: false
        }
    ]);
}
