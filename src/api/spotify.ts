const getAccessToken = async () => {
    const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(
                `${import.meta.env.SPOTIFY_CLIENT_ID}:${import.meta.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token || ''
        })
    });

    return response.json();
};

export const myPlaylists = async () => {
    const { access_token } = await getAccessToken();

    return fetch('https://api.spotify.com/v1/me/playlists?limit=20&offset=0', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
};
