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
            bodyRotation: -1,
            //stamp
            stampSvg:
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="132" viewBox="0 0 132 132"><defs></defs><g><rect fill="rgb(255,255,255)" stroke="none" x="0" y="0" width="132" height="132" transform="matrix(1 0 0 1 0 0)" fill-opacity="1"></rect><path fill="rgb(254,172,238)" stroke="none" paint-order="stroke fill markers" d=" M 0 0 L 132 0 L 132 132 L 0 132 L 0 0 Z" fill-opacity="1"></path><path fill="rgb(148,103,198)" stroke="none" paint-order="stroke fill markers" d=" M 132 66 A 66 66 0 0 1 0 66.00000000000001 L 66 66 Z" fill-opacity="1"></path></g></svg>',
            country: 'Germany',
            postOfficeStampTop: 15, // %
            postOfficeStampRight: 20, // px
            postOfficeStampRotation: -5, // deg
            wavyStampTop: 20, // %
            wavyStampRight: 10, // %
            wavyStampRotation: 5 // deg
        },
        {
            id: 2,
            author: 'Bernd',
            body: 'Et culpa ex officia sint velit irure occaecat do proident eu laboris veniam elit.',
            date: new Date('2023-12-20'),
            isPublished: true,
            marginBottom: 4,
            marginRight: 2,
            rotation: -1,
            penColor: '#3B2F2F',
            paperColor: '#F8F6F2',
            fontSizeFactor: 1.05,
            lineHeight: 1.4,
            authorLeftOffset: -2,
            authorTopOffset: 1,
            authorRotation: 2,
            dateLeftOffset: 3,
            dateTopOffset: -1,
            dateRotation: 1,
            bodyLeftOffset: -2,
            bodyTopOffset: 3,
            bodyRotation: 0,
            stampSvg:
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="132" viewBox="0 0 132 132"><defs></defs><g><rect fill="rgb(255,255,255)" stroke="none" x="0" y="0" width="132" height="132" transform="matrix(1 0 0 1 0 0)" fill-opacity="1"></rect><path fill="rgb(252,191,73)" stroke="none" paint-order="stroke fill markers" d=" M 0 0 L 132 0 L 132 132 L 0 132 L 0 0 Z" fill-opacity="1"></path><path fill="rgb(247,127,0)" stroke="none" paint-order="stroke fill markers" d=" M -2.424800662311759e-14 0 A 132 132 0 0 1 132 132 L 0 132 Z" fill-opacity="1"></path></g></svg>',
            country: 'Austria',
            postOfficeStampTop: 25,
            postOfficeStampRight: 10,
            postOfficeStampRotation: 8,
            wavyStampTop: 30,
            wavyStampRight: 16,
            wavyStampRotation: -3
        },
        {
            id: 3,
            author: 'Mia',
            body: 'Exercitation sint dolor minim.',
            date: new Date('2023-10-01'),
            isPublished: true,
            marginBottom: 3,
            marginRight: 5,
            rotation: 1,
            penColor: '#0A3161',
            paperColor: '#F9F8F4',
            fontSizeFactor: 0.95,
            lineHeight: 1.3,
            authorLeftOffset: 2,
            authorTopOffset: -1,
            authorRotation: 1,
            dateLeftOffset: -3,
            dateTopOffset: 2,
            dateRotation: -2,
            bodyLeftOffset: 1,
            bodyTopOffset: -2,
            bodyRotation: -1,
            stampSvg:
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="132" viewBox="0 0 132 132"><defs></defs><g><rect fill="rgb(255,255,255)" stroke="none" x="0" y="0" width="132" height="132" transform="matrix(1 0 0 1 0 0)" fill-opacity="1"></rect><path fill="rgb(0,119,182)" stroke="none" paint-order="stroke fill markers" d=" M 0 0 L 66 0 L 66 66 L 0 66 L 0 0 Z" fill-opacity="1"></path><path fill="rgb(0,150,199)" stroke="none" paint-order="stroke fill markers" d=" M 66 0 A 66 66 0 0 1 4.0413344371862654e-15 66 L 0 0 Z" fill-opacity="1"></path><path fill="rgb(0,180,216)" stroke="none" paint-order="stroke fill markers" d=" M 0 66 L 66 66 L 66 132 L 0 132 L 0 66 Z" fill-opacity="1"></path><path fill="rgb(0,150,199)" stroke="none" paint-order="stroke fill markers" d=" M 0 66 L 66 66 L 33 99 Z" fill-opacity="1"></path><path fill="rgb(2,62,138)" stroke="none" paint-order="stroke fill markers" d=" M 66 66 L 66 132 L 33 99 Z" fill-opacity="1"></path><path fill="rgb(0,119,182)" stroke="none" paint-order="stroke fill markers" d=" M 66 132 L 0 132 L 33 99 Z" fill-opacity="1"></path><path fill="rgb(2,62,138)" stroke="none" paint-order="stroke fill markers" d=" M 0 132 L 0 66 L 33 99 Z" fill-opacity="1"></path><path fill="rgb(0,150,199)" stroke="none" paint-order="stroke fill markers" d=" M 66 0 L 132 0 L 132 66 L 66 66 L 66 0 Z" fill-opacity="1"></path><path fill="rgb(0,119,182)" stroke="none" paint-order="stroke fill markers" d=" M 66 0 L 132 0 L 66 66 Z" fill-opacity="1"></path><path fill="rgb(72,202,228)" stroke="none" paint-order="stroke fill markers" d=" M 66 66 L 132 66 L 132 132 L 66 132 L 66 66 Z" fill-opacity="1"></path><path fill="rgb(0,150,199)" stroke="none" paint-order="stroke fill markers" d=" M 132 132 L 66 132 L 132 66 Z" fill-opacity="1"></path></g></svg>',
            country: undefined,
            postOfficeStampTop: 30,
            postOfficeStampRight: 30,
            postOfficeStampRotation: 0,
            wavyStampTop: 10,
            wavyStampRight: 5,
            wavyStampRotation: 0
        },
        {
            id: 4,
            author: 'Luise',
            body: 'Nostrud amet excepteur deserunt ullamco nisi id aute.',
            date: new Date('2024-04-12'),
            isPublished: false,
            marginBottom: 2,
            marginRight: 3,
            rotation: 0,
            penColor: '#1F3A3D',
            paperColor: '#FCFAF7',
            fontSizeFactor: 1.0,
            lineHeight: 1.2,
            authorLeftOffset: 1,
            authorTopOffset: 0,
            authorRotation: -1,
            dateLeftOffset: 4,
            dateTopOffset: 2,
            dateRotation: 0,
            bodyLeftOffset: 0,
            bodyTopOffset: -1,
            bodyRotation: 1,
            stampSvg:
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="132" viewBox="0 0 132 132"><defs></defs><g><rect fill="rgb(255,255,255)" stroke="none" x="0" y="0" width="132" height="132" transform="matrix(1 0 0 1 0 0)" fill-opacity="1"></rect><path fill="rgb(236,240,241)" stroke="none" paint-order="stroke fill markers" d=" M 0 0 L 66 0 L 66 66 L 0 66 L 0 0 Z" fill-opacity="1"></path><path fill="rgb(52,152,219)" stroke="none" paint-order="stroke fill markers" d=" M 66 66 A 66 66 0 0 1 0 8.082668874372531e-15 L 66 0 Z" fill-opacity="1"></path><path fill="rgb(231,76,60)" stroke="none" paint-order="stroke fill markers" d=" M 0 66 L 66 66 L 66 132 L 0 132 L 0 66 Z" fill-opacity="1"></path><path fill="rgb(231,76,60)" stroke="none" paint-order="stroke fill markers" d=" M 66 99 A 33 33 0 1 1 65.99998350000138 98.96700000549998 Z" fill-opacity="1"></path><path fill="rgb(231,76,60)" stroke="none" paint-order="stroke fill markers" d=" M 52.8 99 A 19.8 19.8 0 1 1 52.79999010000083 98.98020000329998 Z" fill-opacity="1"></path><path fill="rgb(52,152,219)" stroke="none" paint-order="stroke fill markers" d=" M 66 0 L 132 0 L 132 66 L 66 66 L 66 0 Z" fill-opacity="1"></path><path fill="rgb(236,240,241)" stroke="none" paint-order="stroke fill markers" d=" M 132 0 A 66 66 0 0 1 66 66 L 66 0 Z" fill-opacity="1"></path><path fill="rgb(236,240,241)" stroke="none" paint-order="stroke fill markers" d=" M 66 66 L 132 66 L 132 132 L 66 132 L 66 66 Z" fill-opacity="1"></path><path fill="rgb(46,204,113)" stroke="none" paint-order="stroke fill markers" d=" M 66 66 L 132 66 L 132 132 L 66 132 L 66 66 Z" fill-opacity="1"></path></g></svg>',
            country: 'Switzerland',
            postOfficeStampTop: 10,
            postOfficeStampRight: 40,
            postOfficeStampRotation: 12,
            wavyStampTop: 15,
            wavyStampRight: 13,
            wavyStampRotation: 10
        }
    ]);
}
