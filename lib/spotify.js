const getAccessToken = async () => {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};


export const myAlbums = async (offset, limit) => {
  const { access_token } = await getAccessToken();

  const data = fetch(`https://api.spotify.com/v1/me/albums?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  });

  return data;
};

export const myTopArtists = async () => {
  const { access_token } = await getAccessToken();

  return fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5&offset=0", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const myPlaylists = async () => {
  const { access_token } = await getAccessToken();

  return fetch("https://api.spotify.com/v1/me/playlists?limit=10&offset=0", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
