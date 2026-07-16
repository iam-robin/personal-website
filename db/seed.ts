import { db, Postcard } from "astro:db";

// Four generative stamp SVGs (as produced by the /postcards/new p5 sketch),
// reused across the mock postcards so each card looks complete.
const STAMP_PURPLE =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="132" viewBox="0 0 132 132"><defs></defs><g><rect fill="rgb(255,255,255)" stroke="none" x="0" y="0" width="132" height="132" transform="matrix(1 0 0 1 0 0)" fill-opacity="1"></rect><path fill="rgb(254,172,238)" stroke="none" paint-order="stroke fill markers" d=" M 0 0 L 132 0 L 132 132 L 0 132 L 0 0 Z" fill-opacity="1"></path><path fill="rgb(148,103,198)" stroke="none" paint-order="stroke fill markers" d=" M 132 66 A 66 66 0 0 1 0 66.00000000000001 L 66 66 Z" fill-opacity="1"></path></g></svg>';
const STAMP_ORANGE =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="132" viewBox="0 0 132 132"><defs></defs><g><rect fill="rgb(255,255,255)" stroke="none" x="0" y="0" width="132" height="132" transform="matrix(1 0 0 1 0 0)" fill-opacity="1"></rect><path fill="rgb(252,191,73)" stroke="none" paint-order="stroke fill markers" d=" M 0 0 L 132 0 L 132 132 L 0 132 L 0 0 Z" fill-opacity="1"></path><path fill="rgb(247,127,0)" stroke="none" paint-order="stroke fill markers" d=" M -2.424800662311759e-14 0 A 132 132 0 0 1 132 132 L 0 132 Z" fill-opacity="1"></path></g></svg>';
const STAMP_BLUE =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="132" viewBox="0 0 132 132"><defs></defs><g><rect fill="rgb(255,255,255)" stroke="none" x="0" y="0" width="132" height="132" transform="matrix(1 0 0 1 0 0)" fill-opacity="1"></rect><path fill="rgb(0,119,182)" stroke="none" paint-order="stroke fill markers" d=" M 0 0 L 66 0 L 66 66 L 0 66 L 0 0 Z" fill-opacity="1"></path><path fill="rgb(0,150,199)" stroke="none" paint-order="stroke fill markers" d=" M 66 0 A 66 66 0 0 1 4.0413344371862654e-15 66 L 0 0 Z" fill-opacity="1"></path><path fill="rgb(0,180,216)" stroke="none" paint-order="stroke fill markers" d=" M 0 66 L 66 66 L 66 132 L 0 132 L 0 66 Z" fill-opacity="1"></path><path fill="rgb(0,150,199)" stroke="none" paint-order="stroke fill markers" d=" M 0 66 L 66 66 L 33 99 Z" fill-opacity="1"></path><path fill="rgb(2,62,138)" stroke="none" paint-order="stroke fill markers" d=" M 66 66 L 66 132 L 33 99 Z" fill-opacity="1"></path><path fill="rgb(0,119,182)" stroke="none" paint-order="stroke fill markers" d=" M 66 132 L 0 132 L 33 99 Z" fill-opacity="1"></path><path fill="rgb(2,62,138)" stroke="none" paint-order="stroke fill markers" d=" M 0 132 L 0 66 L 33 99 Z" fill-opacity="1"></path><path fill="rgb(0,150,199)" stroke="none" paint-order="stroke fill markers" d=" M 66 0 L 132 0 L 132 66 L 66 66 L 66 0 Z" fill-opacity="1"></path><path fill="rgb(0,119,182)" stroke="none" paint-order="stroke fill markers" d=" M 66 0 L 132 0 L 66 66 Z" fill-opacity="1"></path><path fill="rgb(72,202,228)" stroke="none" paint-order="stroke fill markers" d=" M 66 66 L 132 66 L 132 132 L 66 132 L 66 66 Z" fill-opacity="1"></path><path fill="rgb(0,150,199)" stroke="none" paint-order="stroke fill markers" d=" M 132 132 L 66 132 L 132 66 Z" fill-opacity="1"></path></g></svg>';
const STAMP_REDGREEN =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="132" viewBox="0 0 132 132"><defs></defs><g><rect fill="rgb(255,255,255)" stroke="none" x="0" y="0" width="132" height="132" transform="matrix(1 0 0 1 0 0)" fill-opacity="1"></rect><path fill="rgb(236,240,241)" stroke="none" paint-order="stroke fill markers" d=" M 0 0 L 66 0 L 66 66 L 0 66 L 0 0 Z" fill-opacity="1"></path><path fill="rgb(52,152,219)" stroke="none" paint-order="stroke fill markers" d=" M 66 66 A 66 66 0 0 1 0 8.082668874372531e-15 L 66 0 Z" fill-opacity="1"></path><path fill="rgb(231,76,60)" stroke="none" paint-order="stroke fill markers" d=" M 0 66 L 66 66 L 66 132 L 0 132 L 0 66 Z" fill-opacity="1"></path><path fill="rgb(231,76,60)" stroke="none" paint-order="stroke fill markers" d=" M 66 99 A 33 33 0 1 1 65.99998350000138 98.96700000549998 Z" fill-opacity="1"></path><path fill="rgb(231,76,60)" stroke="none" paint-order="stroke fill markers" d=" M 52.8 99 A 19.8 19.8 0 1 1 52.79999010000083 98.98020000329998 Z" fill-opacity="1"></path><path fill="rgb(52,152,219)" stroke="none" paint-order="stroke fill markers" d=" M 66 0 L 132 0 L 132 66 L 66 66 L 66 0 Z" fill-opacity="1"></path><path fill="rgb(236,240,241)" stroke="none" paint-order="stroke fill markers" d=" M 132 0 A 66 66 0 0 1 66 66 L 66 0 Z" fill-opacity="1"></path><path fill="rgb(236,240,241)" stroke="none" paint-order="stroke fill markers" d=" M 66 66 L 132 66 L 132 132 L 66 132 L 66 66 Z" fill-opacity="1"></path><path fill="rgb(46,204,113)" stroke="none" paint-order="stroke fill markers" d=" M 66 66 L 132 66 L 132 132 L 66 132 L 66 66 Z" fill-opacity="1"></path></g></svg>';

const STAMPS = [STAMP_PURPLE, STAMP_ORANGE, STAMP_BLUE, STAMP_REDGREEN];
const PEN = ["#000000", "#0A3161", "#00356B", "#1F3A3D", "#2E5090", "#3B2F2F"];
const PAPER = [
    "#FCFAF7",
    "#FAF9F6",
    "#F9F8F4",
    "#F8F7F2",
    "#F9F6F0",
    "#F8F6F2",
    "#F7F4EF",
    "#F2F0E6",
];

/**
 * A compact mock postcard. Fine positioning fields are left to
 * PostcardItem's random defaults; we only vary the things that matter for
 * testing: text, country, links, colours, publish state, dates.
 */
type Mock = {
    id: number;
    author: string;
    body: string;
    date: string;
    isPublished?: boolean;
    country?: string;
    websiteUrl?: string;
};

const mocks: Mock[] = [
    // ── Aliases that all normalise to "United States" (tests count = 3
    //    and filtering to multiple cards under one standard name) ──
    {
        id: 5,
        author: "Dana",
        body: "Greetings from San Francisco! Stumbled onto your site while procrastinating at work. Love the little bird. 🐦",
        date: "2025-01-14",
        country: "USA",
        websiteUrl: "https://example.com",
    },
    {
        id: 6,
        author: "Marcus",
        body: "Hi from New York. The postcards idea is lovely — reminds me of the old, personal web.",
        date: "2025-02-02",
        country: "US",
    },
    {
        id: 7,
        author: "Priya",
        body: "Reading this from a coffee shop in Austin. Keep building fun things on the internet!",
        date: "2025-03-19",
        country: "America",
        websiteUrl: "https://priya.dev",
    },
    // ── More aliases (UK, Holland) ──
    {
        id: 8,
        author: "Oliver",
        body: "Cheers from London! Testing line breaks here:\nHope this second line wraps nicely,\n— on a rainy afternoon.",
        date: "2025-02-27",
        country: "UK",
        websiteUrl: "https://oliver.uk",
    },
    {
        id: 9,
        author: "Sanne",
        body: "Hallo from Amsterdam! Cycling past the canals and thinking the web needs more places like this one.",
        date: "2025-01-30",
        country: "Holland",
    },
    // ── Non-latin characters ──
    {
        id: 10,
        author: "Yuki",
        body: "こんにちは from Tokyo! 東京から挨拶を送ります。Testing non-latin characters on a postcard.",
        date: "2025-03-05",
        country: "Japan",
        websiteUrl: "https://yuki.jp",
    },
    // ── Spread across continents (populates the world map) ──
    {
        id: 11,
        author: "Lucas",
        body: "Olá from São Paulo! Sending a little sunshine your way. ☀️",
        date: "2024-11-11",
        country: "Brazil",
    },
    {
        id: 12,
        author: "Emma",
        body: "Hello from Toronto, eh! Short and sweet.",
        date: "2024-12-01",
        country: "Canada",
        websiteUrl: "https://emma.ca",
    },
    {
        id: 13,
        author: "Jack",
        body: "G'day!",
        date: "2025-01-08",
        country: "Australia",
    },
    // ── A really long message, right up to the 270-char limit ──
    {
        id: 14,
        author: "Camille",
        body: "Bonjour from Paris! I wanted to write a properly long message to see how the handwriting wraps when someone really goes for it — filling nearly the whole card with thoughts, tangents, and a few too many commas, right up until the limit finally stops me.",
        date: "2025-02-14",
        country: "France",
        websiteUrl: "https://camille.fr",
    },
    {
        id: 15,
        author: "Arjun",
        body: "Namaste from Bengaluru! Your garden notes were genuinely inspiring — thank you for sharing them.",
        date: "2025-03-22",
        country: "India",
    },
    // ── Very long author name, no website ──
    {
        id: 16,
        author: "Maximilian Alexander von Habsburg-Lothringen",
        body: "Hej from Stockholm! No website on this one, just saying hello across the sea.",
        date: "2025-01-19",
        country: "Sweden",
    },
    {
        id: 17,
        author: "Thabo",
        body: "Hello from Cape Town! The little world map at the bottom is a lovely touch.",
        date: "2024-12-22",
        country: "South Africa",
        websiteUrl: "https://thabo.co.za",
    },
    // ── Unknown / invalid country: stored & shown under "All", but never
    //    a filter chip and never highlighted on the map ──
    {
        id: 18,
        author: "Nemo",
        body: "Sending this from the lost city of Atlantis 🔱 — let's see whether an unknown country still shows up in the list.",
        date: "2025-02-09",
        country: "Atlantis",
    },
    // ── No country at all (tests the "no country stamp" path) ──
    {
        id: 19,
        author: "Anon",
        body: "No country on this one — just here to say your site made me smile today.",
        date: "2025-03-01",
    },
    // ── Unpublished (must NOT appear anywhere, and must NOT inflate the
    //    United States count) ──
    {
        id: 20,
        author: "Spam Bot",
        body: "This one is unpublished — it should never appear on the page or count toward any total.",
        date: "2025-03-25",
        isPublished: false,
        country: "United States",
    },
];

// ── Bulk filler so the local DB exceeds one page (24) and exercises the
//    numbered pagination the way production (200+ postcards) does. ──
const FILLER_COUNTRIES: (string | undefined)[] = [
    "Spain",
    "Italy",
    "Norway",
    "Poland",
    "Mexico",
    "Argentina",
    "Kenya",
    "Thailand",
    "Vietnam",
    "Greece",
    "Portugal",
    "Ireland",
    "Finland",
    "Belgium",
    "Turkey",
    "New Zealand",
    undefined,
    "Germany",
    "United States",
    "United Kingdom",
];
const FILLER_BODIES = [
    "Just stopped by to say hello — lovely little corner of the web you have here.",
    "Reading this on my commute. Made me smile, thank you!",
    "Found you through a friend's blogroll. Keeping the old web alive!",
    "Greetings from far away. Your writing is a joy to read.",
    "A quick note to say I appreciate what you're building here.",
    "Hello from the other side of the world! Keep it up.",
];
for (let i = 0; i < 42; i++) {
    mocks.push({
        id: 21 + i,
        author: `Visitor ${21 + i}`,
        body: FILLER_BODIES[i % FILLER_BODIES.length],
        date: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String(
            (i % 27) + 1,
        ).padStart(2, "0")}`,
        country: FILLER_COUNTRIES[i % FILLER_COUNTRIES.length],
        websiteUrl: i % 3 === 0 ? "https://example.com" : undefined,
    });
}

export default async function () {
    await db.insert(Postcard).values([
        {
            id: 1,
            author: "Hannah",
            body: "veniam consequat enim irure adipisicing et anim velit pariatur anim minim eu ad veniam eiusmod laborum pariatur minim ullamco esse exercitation ea pariatur et anim nostrud laborum ipsum cillum pariatur sunt consequat laborum nostrud proident mollit sint adipisicing adipisicing elit magna quis magna deserunt duis cupidatat ea irure in aliqua qui mollit incididunt laborum id consectetur aute ea quis deserunt occaecat excepteur exercitation Lorem incididunt velit sit velit nulla dolor veniam fugiat laborum anim eiusmod ad ut sit incididunt velit esse dolore in ullamco laboris ipsum qui ad cupidatat aute commodo adipisicing ipsum sit consectetur adipisicing sit nisi eu aute sit ea cillum cillum excepteur consequat cillum velit et ad aliquip ex mollit Lorem enim veniam ipsum exercitation consequat id dolore esse esse minim ad adipisicing sunt aliquip aute excepteur esse ipsum officia enim officia qui minim dolore deserunt tempor mollit ad incididunt excepteur Lorem culpa ipsum laboris est duis aliqua enim commodo incididunt ipsum ea nostrud ad aliqua",
            date: new Date("2023-10-01"),
            isPublished: true,
            websiteUrl: "https://google.com",
            marginBottom: 3,
            marginRight: 5,
            rotation: 1,
            penColor: "#0A3161",
            paperColor: "#F9F8F4",
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
            stampSvg: STAMP_PURPLE,
            country: "Germany",
            postOfficeStampTop: -12,
            postOfficeStampRight: 20,
            postOfficeStampRotation: -5,
            wavyStampTop: 20,
            wavyStampRight: 72,
            wavyStampRotation: 5,
        },
        {
            id: 2,
            author: "Bernd",
            body: "Et culpa ex officia sint velit irure occaecat do proident eu laboris veniam elit.",
            date: new Date("2023-12-20"),
            isPublished: true,
            websiteUrl: "https://pinterest.com",
            marginBottom: 4,
            marginRight: 2,
            rotation: -1,
            penColor: "#3B2F2F",
            paperColor: "#F8F6F2",
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
            stampSvg: STAMP_ORANGE,
            country: "Austria",
            postOfficeStampTop: 120,
            postOfficeStampRight: 10,
            postOfficeStampRotation: 8,
            wavyStampTop: 72,
            wavyStampRight: -24,
            wavyStampRotation: -3,
        },
        {
            id: 3,
            author: "Mia",
            body: "Exercitation sint dolor minim.",
            date: new Date("2023-10-01"),
            isPublished: true,
            marginBottom: 3,
            marginRight: 5,
            rotation: 1,
            penColor: "#0A3161",
            paperColor: "#F9F8F4",
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
            stampSvg: STAMP_BLUE,
            country: undefined,
            postOfficeStampTop: 30,
            postOfficeStampRight: 30,
            postOfficeStampRotation: 0,
            wavyStampTop: 4,
            wavyStampRight: 50,
            wavyStampRotation: 0,
        },
        {
            id: 4,
            author: "Luise",
            body: "Nostrud amet excepteur deserunt ullamco nisi id aute.",
            date: new Date("2024-04-12"),
            isPublished: false,
            marginBottom: 2,
            marginRight: 3,
            rotation: 0,
            penColor: "#1F3A3D",
            paperColor: "#FCFAF7",
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
            stampSvg: STAMP_REDGREEN,
            country: "Switzerland",
            postOfficeStampTop: 10,
            postOfficeStampRight: 40,
            postOfficeStampRotation: 12,
            wavyStampTop: 45,
            wavyStampRight: 24,
            wavyStampRotation: 10,
        },
        // Expanded mock set (edge cases) — see the `mocks` array above.
        ...mocks.map((m, i) => ({
            id: m.id,
            author: m.author,
            body: m.body,
            date: new Date(m.date),
            isPublished: m.isPublished ?? true,
            country: m.country,
            websiteUrl: m.websiteUrl,
            penColor: PEN[i % PEN.length],
            paperColor: PAPER[i % PAPER.length],
            stampSvg: STAMPS[i % STAMPS.length],
        })),
    ]);
}
