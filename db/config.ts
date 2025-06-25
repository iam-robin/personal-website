import { defineDb, defineTable, column } from 'astro:db';
// https://astro.build/db/config

const Postcard = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        author: column.text(),
        body: column.text(),
        date: column.date(),
        isPublished: column.boolean(),
        // Card positioning and rotation
        marginBottom: column.number({ optional: true }),
        marginRight: column.number({ optional: true }),
        rotation: column.number({ optional: true }),
        // Pen and paper colors
        penColor: column.text({ optional: true }),
        paperColor: column.text({ optional: true }),
        // Font sizing
        fontSizeFactor: column.number({ optional: true }),
        lineHeight: column.number({ optional: true }),
        // Author positioning
        authorLeftOffset: column.number({ optional: true }),
        authorTopOffset: column.number({ optional: true }),
        authorRotation: column.number({ optional: true }),
        // Date positioning
        dateLeftOffset: column.number({ optional: true }),
        dateTopOffset: column.number({ optional: true }),
        dateRotation: column.number({ optional: true }),
        // Body text positioning
        bodyLeftOffset: column.number({ optional: true }),
        bodyTopOffset: column.number({ optional: true }),
        bodyRotation: column.number({ optional: true }),
        //stamp
        stampSvg: column.text({ optional: true }),
        //country
        country: column.text({ optional: true }),
        //website
        websiteUrl: column.text({ optional: true }),
        // Post Office Stamp styling
        postOfficeStampTop: column.number({ optional: true }), // Percentage
        postOfficeStampRight: column.number({ optional: true }), // Percentage
        postOfficeStampRotation: column.number({ optional: true }), // Degrees
        // New Wavy Lines Stamp styling
        wavyStampTop: column.number({ optional: true }), // Percentage
        wavyStampRight: column.number({ optional: true }), // Percentage
        wavyStampRotation: column.number({ optional: true }) // Degrees
    }
});

export default defineDb({
    tables: { Postcard }
});
