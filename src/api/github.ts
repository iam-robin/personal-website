import matter from 'gray-matter';

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

export interface GardenCategory {
    name: string;
    type: string;
    path: string;
    object: {
        text: string;
        byteSize: number;
        entries: any;
    };
}

export interface GardenEntry {
    name: string;
    type: string;
    object: {
        text: string;
        byteSize: number;
        abbreviatedOid: string;
    };
    frontmatter: {
        created: string;
        edited: string;
        description: string;
        path: string;
    };
}

export const categoriesWhitelist = [
    'art',
    'projects',
    'design',
    'books',
    // 'misc notes',
    'society',
    'psychology',
    'photography',
    'technology',
    'poems'
];

export async function parseMarkdownContent(content: any) {
    const { data, content: body } = matter(content);

    const frontmatter = {
        created: data.created || '',
        edited: data.edited || '',
        description: data.description || ''
    };

    return { frontmatter, body };
}

async function fetchFromGitHubGraphQL(path = '', slug = '') {
    let expression = 'HEAD:';
    if (path || slug) {
        expression += path ? `${path}` : '';
        expression += slug ? `/${slug}` : '';
    }

    const query = `
    query fetchEntries($owner: String!, $name: String!, $expression: String!) {
        repository(owner: $owner, name: $name) {
            object(expression: $expression) {
                ... on Tree {
                    entries {
                        name
                        type
                        path
                        object {
                            ... on Tree {
                                entries {
                                    name
                                    type
                                }
                            }
                            ... on Blob {
                                text
                                byteSize
                                abbreviatedOid
                            }
                        }
                    }
                }
                ... on Blob {
                    text
                    byteSize
                }
            }
        }
    }
  `;

    const variables = {
        owner: 'iam-robin',
        name: 'obsidian-garden',
        expression
    };

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GITHUB_TOKEN}`
        },
        body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
}

export async function getObsidianGardenCategories() {
    try {
        const fetchResponse = await fetchFromGitHubGraphQL();

        const {
            data: {
                repository: { object }
            }
        } = fetchResponse;

        if (!object) throw new Error('No data returned from the GraphQL query.');

        // Handling multiple entries within a given path
        if (object.entries) {
            const filteredEntries = object.entries.filter((entry: any) => {
                return categoriesWhitelist.includes(entry.name);
            });
            return filteredEntries;
        } else {
            throw new Error('Unexpected data structure returned from the GraphQL query.');
        }
    } catch (error) {
        console.error('Error fetching data from GitHub:', error);
        return [];
    }
}

export async function getAllObsidianGardenEntries(
    path = '',
    slug = '',
    filter?: 'created' | 'edited'
) {
    try {
        const fetchResponse = await fetchFromGitHubGraphQL(path, slug);

        const {
            data: {
                repository: { object }
            }
        } = fetchResponse;

        if (!object) throw new Error('No data returned from the GraphQL query.');

        // Handling a single entry (slug provided)
        if (slug && object.text) {
            return [await parseMarkdownContent(object.text)];
        }

        const results: any[] = [];
        // Handling multiple entries within a given path
        if (object.entries) {
            for (const entry of object.entries) {
                const parsedContent = await parseMarkdownContent(entry.object.text);
                const { frontmatter, body } = parsedContent;

                entry.path = entry.path.split('/')[0];

                // Add the entry to the results array
                results.push({
                    ...entry,
                    frontmatter,
                    body
                });
            }
        } else {
            throw new Error('Unexpected data structure returned from the GraphQL query.');
        }
        if (filter === 'created') {
            return results.sort(
                (a, b) =>
                    new Date(b.frontmatter.created).getTime() -
                    new Date(a.frontmatter.created).getTime()
            );
        } else if (filter === 'edited') {
            return results.sort(
                (a, b) =>
                    new Date(b.frontmatter.edited).getTime() -
                    new Date(a.frontmatter.edited).getTime()
            );
        } else {
            return results;
        }
    } catch (error) {
        console.error('Error fetching data from GitHub:', error);
        return [];
    }
}

export async function getNewestObsidianGardenEntries(amount: number, filter: 'created' | 'edited') {
    try {
        const results: any[] = [];

        for (const category of categoriesWhitelist) {
            const fetchResponse = await fetchFromGitHubGraphQL(category);
            const {
                data: {
                    repository: { object }
                }
            } = fetchResponse;

            if (!object) throw new Error('No data returned from the GraphQL query.');

            if (object.entries) {
                for (const entry of object.entries) {
                    const parsedContent = await parseMarkdownContent(entry.object.text);
                    const { frontmatter, body } = parsedContent;

                    entry.path = entry.path.split('/')[0];

                    // Add the entry to the results array
                    results.push({
                        ...entry,
                        frontmatter,
                        body
                    });
                }
            }
        }

        if (filter === 'created') {
            return results
                .sort(
                    (a, b) =>
                        new Date(b.frontmatter.created).getTime() -
                        new Date(a.frontmatter.created).getTime()
                )
                .slice(0, amount);
        } else if (filter === 'edited') {
            return results
                .sort(
                    (a, b) =>
                        new Date(b.frontmatter.edited).getTime() -
                        new Date(a.frontmatter.edited).getTime()
                )
                .slice(0, amount);
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching data from GitHub:', error);
        return [];
    }
}
