import { parse } from "node-html-parser";

export interface LetterboxdFilm {
    watched_on: string;
    title: string;
    rating: number;
    rewatched: boolean;
    permalink: string;
    liked: boolean;
    posterUrl?: string;
}

export interface LetterboxdData {
    updated_at: string;
    count: number;
    films: LetterboxdFilm[];
}

const LETTERBOXD_BASE_URL = "https://letterboxd.com";

async function fetchPage(pageNumber: number, username: string): Promise<any> {
    const url = `${LETTERBOXD_BASE_URL}/${username}/films/diary/page/${pageNumber}`;
    const response = await fetch(url);
    const text = await response.text();
    return parse(text);
}

async function getTotalPages(root: any): Promise<number> {
    const pagination = root.querySelector(".paginate-pages");
    if (!pagination) return 1;

    const pageLinks = pagination.querySelectorAll("li a");
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
        const filmEntries = pageRoot.querySelectorAll(".diary-entry-row");

        console.log(`Found ${filmEntries.length} film entries on page ${i}`);

        for (const entry of filmEntries) {
            const titleEl = entry.querySelector(
                ".inline-production-masthead h2 a"
            );
            const title = titleEl.innerHTML;
            const permalinkWithProfile = titleEl.getAttribute("href");
            let permalink = permalinkWithProfile.split("/").slice(2).join("/");
            // Remove trailing number (e.g., /1/, /2/) for rewatches
            permalink = permalink.replace(/\/\d+\/$/, "/");
            const dateLink = entry
                .querySelector(".daydate")
                ?.getAttribute("href");
            const dateParts = dateLink.split("/").filter(Boolean);
            const date = dateParts.slice(-3).join("-");
            const rewatched = !entry.querySelector(
                ".col-rewatch.icon-status-off"
            );
            const liked = !!entry.querySelector(".col-like .icon-liked");

            // Get rating from the hidden input field that contains the actual value
            const ratingInput = entry.querySelector(
                ".col-rating input.rateit-field"
            );

            let rating = 0;
            if (ratingInput) {
                const ratingValue = ratingInput.getAttribute("value");
                if (ratingValue) {
                    rating = parseInt(ratingValue, 10) / 2; // Convert from 0-10 to 0-5 scale
                }
            }

            // Extract poster URL by constructing it from film ID and slug with fallbacks
            let posterUrl: string | undefined;
            const reactComponent = entry.querySelector(
                ".react-component.figure"
            );
            if (reactComponent) {
                const filmId = reactComponent.getAttribute("data-film-id");
                const filmSlug = reactComponent.getAttribute("data-item-slug");
                const itemName = reactComponent.getAttribute("data-item-name");

                if (filmId && filmSlug) {
                    // Convert film ID to path by splitting digits with slashes
                    const idPath = filmId.split("").join("/");

                    // Create multiple slug candidates
                    const slugCandidates = [
                        filmSlug, // Full slug (e.g., "perfect-days-2023")
                        filmSlug.replace(/-\d{4}$/, ""), // Remove year suffix (e.g., "perfect-days")
                    ];

                    // If we have item name, also try converting it to a slug
                    if (itemName) {
                        const nameSlug = itemName
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
                            .replace(/\s+/g, "-") // Replace spaces with hyphens
                            .replace(/-+/g, "-"); // Remove multiple hyphens
                        slugCandidates.push(nameSlug);
                    }

                    // Size candidates (width x height)
                    const sizeCandidates = [
                        "0-300-0-450", // Preferred large size
                        "0-230-0-345", // Medium size
                        "0-150-0-225", // Smaller fallback
                    ];

                    // Try different combinations and validate URLs
                    outerLoop: for (const slug of slugCandidates) {
                        for (const size of sizeCandidates) {
                            const candidateUrl = `https://a.ltrbxd.com/resized/film-poster/${idPath}/${filmId}-${slug}-${size}-crop.jpg`;

                            try {
                                // Quick HEAD request to check if the image exists
                                const response = await fetch(candidateUrl, {
                                    method: "HEAD",
                                });
                                if (response.ok) {
                                    posterUrl = candidateUrl;
                                    break outerLoop;
                                }
                            } catch (error) {
                                // Continue to next candidate if this one fails
                                continue;
                            }
                        }
                    }

                    if (!posterUrl) {
                        console.log(
                            `✗ No working poster found for film ID ${filmId}, slug: ${filmSlug}`
                        );
                    }
                }
            }

            films.push({
                title,
                permalink,
                watched_on: date,
                rating,
                rewatched,
                liked,
                posterUrl,
            });
        }

        // Add a small delay to be respectful to Letterboxd servers
        if (i < totalPages) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    console.log(`Scraped ${films.length} films total`);

    return {
        updated_at: new Date().toISOString(),
        count: films.length,
        films,
    };
}
