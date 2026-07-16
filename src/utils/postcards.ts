import { db, Postcard, desc, eq } from "astro:db";

/** The newest published postcards, newest first. */
export async function getNewestPostcards(limit = 3) {
    return db
        .select()
        .from(Postcard)
        .where(eq(Postcard.isPublished, true))
        .orderBy(desc(Postcard.date))
        .limit(limit);
}

/** Map a DB row to PostcardItem props (drizzle nulls → undefined). */
export const toPostcardProps = (postcard: typeof Postcard.$inferSelect) => ({
    author: postcard.author,
    body: postcard.body,
    date: postcard.date,
    marginBottom: postcard.marginBottom ?? undefined,
    marginRight: postcard.marginRight ?? undefined,
    rotation: postcard.rotation ?? undefined,
    penColor: postcard.penColor ?? undefined,
    paperColor: postcard.paperColor ?? undefined,
    fontSizeFactor: postcard.fontSizeFactor ?? undefined,
    lineHeight: postcard.lineHeight ?? undefined,
    authorLeftOffset: postcard.authorLeftOffset ?? undefined,
    authorTopOffset: postcard.authorTopOffset ?? undefined,
    authorRotation: postcard.authorRotation ?? undefined,
    dateLeftOffset: postcard.dateLeftOffset ?? undefined,
    dateTopOffset: postcard.dateTopOffset ?? undefined,
    dateRotation: postcard.dateRotation ?? undefined,
    bodyLeftOffset: postcard.bodyLeftOffset ?? undefined,
    bodyTopOffset: postcard.bodyTopOffset ?? undefined,
    bodyRotation: postcard.bodyRotation ?? undefined,
    stampSvg: postcard.stampSvg ?? undefined,
    country: postcard.country,
    websiteUrl: postcard.websiteUrl,
    postOfficeStampTop: postcard.postOfficeStampTop ?? undefined,
    postOfficeStampRight: postcard.postOfficeStampRight ?? undefined,
    postOfficeStampRotation: postcard.postOfficeStampRotation ?? undefined,
    wavyStampTop: postcard.wavyStampTop ?? undefined,
    wavyStampRight: postcard.wavyStampRight ?? undefined,
    wavyStampRotation: postcard.wavyStampRotation ?? undefined,
});
