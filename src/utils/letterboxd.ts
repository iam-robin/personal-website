import { parse } from 'node-html-parser';

export interface LetterboxdFilm {
    watched_on: string;
    title: string;
    rating: number;
    rewatched: boolean;
    permalink: string;
    liked: boolean;
}

export interface LetterboxdData {
    updated_at: string;
    count: number;
    films: LetterboxdFilm[];
}

const LETTERBOXD_BASE_URL = 'https://letterboxd.com';

async function fetchPage(pageNumber: number, username: string): Promise<any> {
    const url = `${LETTERBOXD_BASE_URL}/${username}/films/diary/page/${pageNumber}`;
    const response = await fetch(url);
    const text = await response.text();
    return parse(text);
}

async function getTotalPages(root: any): Promise<number> {
    const pagination = root.querySelector('.paginate-pages');
    if (!pagination) return 1;

    const pageLinks = pagination.querySelectorAll('li a');
    if (pageLinks.length === 0) return 1;

    const lastPageLink = pageLinks[pageLinks.length - 1];
    return lastPageLink ? parseInt(lastPageLink.text.trim(), 10) : 1;
}

export async function scrapeLetterboxdFilms(
    username: string,
    maxPages: number = 10
): Promise<LetterboxdData> {
    console.log(`Starting to scrape Letterboxd films for user: ${username}`);

    const root = await fetchPage(1, username);
    const totalPages = Math.min(await getTotalPages(root), maxPages);
    const films: any[] = [];

    for (let i = 1; i <= totalPages; i++) {
        console.log(`Scraping page ${i}...`);

        const pageRoot = await fetchPage(i, username);
        const filmEntries = pageRoot.querySelectorAll('.diary-entry-row');

        console.log(`Found ${filmEntries.length} film entries on page ${i}`);

        filmEntries.forEach((entry: any) => {
            const titleEl = entry.querySelector('.inline-production-masthead h2 a');
            const title = titleEl.innerHTML;
            const permalinkWithProfile = titleEl.getAttribute('href');
            const permalink = permalinkWithProfile.split('/').slice(2).join('/');
            const dateLink = entry.querySelector('.daydate')?.getAttribute('href');
            const dateParts = dateLink.split('/').filter(Boolean);
            const date = dateParts.slice(-3).join('-');
            const rewatched = !entry.querySelector('.col-rewatch.icon-status-off');
            const liked = !!entry.querySelector('.col-like .icon-liked');

            // Get rating from the hidden input field that contains the actual value
            const ratingInput = entry.querySelector('.col-rating input.rateit-field');

            let rating = 0;
            if (ratingInput) {
                const ratingValue = ratingInput.getAttribute('value');
                if (ratingValue) {
                    rating = parseInt(ratingValue, 10) / 2; // Convert from 0-10 to 0-5 scale
                }
            }

            films.push({
                title,
                permalink,
                watched_on: date,
                rating,
                rewatched,
                liked
            });
        });

        // Add a small delay to be respectful to Letterboxd servers
        if (i < totalPages) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    console.log(`Scraped ${films.length} films total`);

    return {
        updated_at: new Date().toISOString(),
        count: films.length,
        films
    };
}
