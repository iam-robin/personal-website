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
        marginBottom: column.number(),
        marginRight: column.number(),
        rotation: column.number(),
        // Pen and paper colors
        penColor: column.text(),
        paperColor: column.text(),
        // Font sizing
        fontSizeFactor: column.number(),
        lineHeight: column.number(),
        // Author positioning
        authorLeftOffset: column.number(),
        authorTopOffset: column.number(),
        authorRotation: column.number(),
        // Date positioning
        dateLeftOffset: column.number(),
        dateTopOffset: column.number(),
        dateRotation: column.number(),
        // Body text positioning
        bodyLeftOffset: column.number(),
        bodyTopOffset: column.number(),
        bodyRotation: column.number(),
        //stamp
        stampSvg: column.text()
    }
});

export default defineDb({
    tables: { Postcard }
});
