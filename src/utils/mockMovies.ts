import type { LetterboxdData } from './letterboxd';

export const getMockMovieData = (): LetterboxdData => {
    return {
        films: [
            {
                title: 'The Shawshank Redemption',
                watched_on: '2025-01-15',
                rating: 5,
                liked: true,
                rewatched: false,
                permalink: 'film/the-shawshank-redemption/',
                posterUrl:
                    'https://a.ltrbxd.com/resized/sm/upload/7l/hn/46/uz/zGINvGjdlO6TJRu9wESQvWlOKVT-0-230-0-345-crop.jpg?v=8736d1c395'
            },
            {
                title: 'Pulp Fiction',
                watched_on: '2024-12-28',
                rating: 4.5,
                liked: true,
                rewatched: true,
                permalink: 'film/pulp-fiction/',
                posterUrl:
                    'https://a.ltrbxd.com/resized/film-poster/5/1/4/4/4/51444-pulp-fiction-0-230-0-345-crop.jpg?v=dee19a8077'
            },
            {
                title: 'Fight Club',
                watched_on: '2024-11-02',
                rating: 4,
                liked: false,
                rewatched: true,
                permalink: 'film/fight-club/',
                posterUrl:
                    'https://a.ltrbxd.com/resized/film-poster/5/1/5/6/8/51568-fight-club-0-230-0-345-crop.jpg?v=768b32dfa4'
            }
        ],
        count: 3,
        updated_at: new Date().toISOString()
    };
};
