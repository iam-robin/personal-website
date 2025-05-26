import { defineDb, defineTable, column } from 'astro:db';
// https://astro.build/db/config

const Postcard = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        author: column.text(),
        body: column.text(),
        date: column.date(),
        isPublished: column.boolean()
    }
});

export default defineDb({
    tables: { Postcard }
});
