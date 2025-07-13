export const shelfQueryResponse = async () => {
    const response = await fetch('https://literal.club/graphql/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.LITERAL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
            query: `
        query getShelvesByProfileId(
      $profileId: String!
      $limit: Int!
      $offset: Int!
    ) {
      getShelvesByProfileId(
        profileId: $profileId
        limit: $limit
        offset: $offset
      ) {
        title
        books {
          title
          cover
          pageCount
          id
          slug
          authors {
            name
          }
        }
      }
    }
      `,
            variables: {
                limit: 100,
                offset: 0,
                profileId: import.meta.env.LITERAL_PROFILE_ID
            }
        })
    });

    const data = await response.json();
    const allShelves = data.data.getShelvesByProfileId;
    
    // Filter shelves to only include those with titles starting with "20" (yearly shelves)
    const shelves = allShelves.filter((shelf: any) => shelf.title.startsWith('20'));

    const reviewQuery = `
        query getReviews($pairs: [ProfileIdBookIdInput!]!) {
            reviews(pairs: $pairs) {
                id
                rating
                spoiler
                text
                createdAt
                updatedAt
                tags
            }
        }
    `;

    for (const shelf of shelves) {
        for (const book of shelf.books) {
            const reviewResponse = await fetch('https://literal.club/graphql/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.LITERAL_ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    query: reviewQuery,
                    variables: {
                        pairs: [{ profileId: import.meta.env.LITERAL_PROFILE_ID, bookId: book.id }]
                    }
                })
            });

            const reviewData = await reviewResponse.json();
            if (reviewData.data?.reviews?.length > 0) {
                book.review = reviewData.data.reviews[0];
            }
        }
    }

    return shelves;
};

export const currentlyReadingQueryResponse = async () => {
    const response = await fetch('https://literal.club/graphql/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.LITERAL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
            query: `
            query booksByReadingStateAndProfile(
                $limit: Int!
                $offset: Int!
                $readingStatus: ReadingStatus!
                $profileId: String!
                ) {
                booksByReadingStateAndProfile(
                    limit: $limit
                    offset: $offset
                    readingStatus: $readingStatus
                    profileId: $profileId
                ) {
                    title
                    cover
                    pageCount
                    id
                    slug
                    authors {
                        name
                    }
                }
            }
          `,
            variables: {
                limit: 10,
                offset: 0,
                readingStatus: 'IS_READING',
                profileId: import.meta.env.LITERAL_PROFILE_ID
            }
        })
    });

    return response.json();
};
