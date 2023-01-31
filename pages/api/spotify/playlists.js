import { myPlaylists } from "../../../lib/spotify";

export default async function handler(req, res) {
  const response = await myPlaylists();
  const { items } = await response.json();

  const playlists = items.map((playlist) => ({
    name: playlist.name,
    url: playlist.external_urls.spotify,
    image: playlist.images[0].url,
    tracks: playlist.tracks.total,
    description: playlist.description,
  }));

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200"
  );

  return res.status(200).json(playlists);
}
