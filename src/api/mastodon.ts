// Interface for Mastodon Status response
interface MastodonStatus {
    id: string;
    created_at: string;
    content: string;
    url: string;
    visibility: string;
    favourites_count: number;
    reblogs_count: number;
    replies_count: number;
    account: {
        id: string;
        username: string;
        display_name: string;
        avatar: string;
        url: string;
    };
    media_attachments: Array<any>;
    // Additional fields available as needed
}

const getMastodonStatus = async (statusId: string): Promise<MastodonStatus> => {
    try {
        const response = await fetch(`https://mastodon.social/api/v1/statuses/${statusId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Mastodon API responded with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Mastodon status:', error);
        throw error;
    }
};

export { getMastodonStatus };
