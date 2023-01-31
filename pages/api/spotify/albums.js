import { myAlbums } from "../../../lib/spotify";

export default async function handler(req, res) {

  const limit = 50;
  const maxItems = 250;
  let alldata = [];

  for (let i = limit; i <= maxItems; i += limit) {
    const response = await myAlbums(i - limit, limit);
    const { items } = await response.json();
    alldata = [...alldata, ...items];
  };

  const albums = alldata.map((item) => ({
    name: item.album?.name,
    artist: item.album.artists.map((_artist) => _artist.name).join(", "),
    url: item.album?.external_urls?.spotify,
    coverImage: item.album?.images[1],
  }));

  albums.sort(function(a, b) {
    var textA = a.artist.toUpperCase();
    var textB = b.artist.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200"
  );

  return res.status(200).json(albums);
}
