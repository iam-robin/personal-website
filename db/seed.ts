import { db, Postcard } from 'astro:db';

export default async function () {
    await db.insert(Postcard).values([
        {
            id: 1,
            author: 'Hannah',
            body: 'Culpa esse officia consequat qui eu quis cillum cillum minim excepteur culpa cillum.',
            date: new Date('2023-10-01'),
            isPublished: true,
            // Card positioning and rotation
            marginBottom: 3,
            marginRight: 5,
            rotation: 1,
            // Pen and paper colors
            penColor: '#0A3161',
            paperColor: '#F9F8F4',
            // Font sizing
            fontSizeFactor: 0.95,
            lineHeight: 1.3,
            // Author positioning
            authorLeftOffset: 2,
            authorTopOffset: -1,
            authorRotation: 1,
            // Date positioning
            dateLeftOffset: -3,
            dateTopOffset: 2,
            dateRotation: -2,
            // Body text positioning
            bodyLeftOffset: 1,
            bodyTopOffset: -2,
            bodyRotation: -1
        },
        {
            id: 2,
            author: 'Bernd',
            body: 'Et culpa ex officia sint velit irure occaecat do proident eu laboris veniam elit.',
            date: new Date('2023-12-20'),
            isPublished: true,
            // Card positioning and rotation
            marginBottom: 4,
            marginRight: 2,
            rotation: -1,
            // Pen and paper colors
            penColor: '#3B2F2F',
            paperColor: '#F8F6F2',
            // Font sizing
            fontSizeFactor: 1.05,
            lineHeight: 1.4,
            // Author positioning
            authorLeftOffset: -2,
            authorTopOffset: 1,
            authorRotation: 2,
            // Date positioning
            dateLeftOffset: 3,
            dateTopOffset: -1,
            dateRotation: 1,
            // Body text positioning
            bodyLeftOffset: -2,
            bodyTopOffset: 3,
            bodyRotation: 0
        },
        {
            id: 3,
            author: 'Luise',
            body: 'Nostrud amet excepteur deserunt ullamco nisi id aute.',
            date: new Date('2024-04-12'),
            isPublished: false,
            // Card positioning and rotation
            marginBottom: 2,
            marginRight: 3,
            rotation: 0,
            // Pen and paper colors
            penColor: '#1F3A3D',
            paperColor: '#FCFAF7',
            // Font sizing
            fontSizeFactor: 1.0,
            lineHeight: 1.2,
            // Author positioning
            authorLeftOffset: 1,
            authorTopOffset: 0,
            authorRotation: -1,
            // Date positioning
            dateLeftOffset: 4,
            dateTopOffset: 2,
            dateRotation: 0,
            // Body text positioning
            bodyLeftOffset: 0,
            bodyTopOffset: -1,
            bodyRotation: 1
        }
    ]);
}
