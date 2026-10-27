import { defineDb, defineTable, column } from "astro:db";

const Postcard = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        author: column.text(),
        body: column.text(),
        date: column.date(),
        isPublished: column.boolean(),
        marginBottom: column.number({ optional: true }),
        marginRight: column.number({ optional: true }),
        rotation: column.number({ optional: true }),
        penColor: column.text({ optional: true }),
        paperColor: column.text({ optional: true }),
        fontSizeFactor: column.number({ optional: true }),
        lineHeight: column.number({ optional: true }),
        authorLeftOffset: column.number({ optional: true }),
        authorTopOffset: column.number({ optional: true }),
        authorRotation: column.number({ optional: true }),
        dateLeftOffset: column.number({ optional: true }),
        dateTopOffset: column.number({ optional: true }),
        dateRotation: column.number({ optional: true }),
        bodyLeftOffset: column.number({ optional: true }),
        bodyTopOffset: column.number({ optional: true }),
        bodyRotation: column.number({ optional: true }),
        stampSvg: column.text({ optional: true }),
        country: column.text({ optional: true }),
        websiteUrl: column.text({ optional: true }),
        postOfficeStampTop: column.number({ optional: true }), // Percentage
        postOfficeStampRight: column.number({ optional: true }), // Percentage
        postOfficeStampRotation: column.number({ optional: true }), // Degrees
        wavyStampTop: column.number({ optional: true }), // Percentage
        wavyStampRight: column.number({ optional: true }), // Percentage
        wavyStampRotation: column.number({ optional: true }), // Degrees
    },
});

export default defineDb({
    tables: { Postcard },
});
