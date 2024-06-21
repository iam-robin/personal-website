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

    return response.json();
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
