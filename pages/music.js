import PageHeader from "../components/PageHeader";
import MusicItem from "../components/MusicItem";
import PlaylistItem from "../components/PlaylistItem";
import clsx from "clsx";
import TextLink from "../components/TextLink";
import { useState } from "react";
import { myPlaylists } from "../lib/spotify";

export async function getStaticProps() {
  const count = 12;

  const response = await myPlaylists();
  const { items } = await response.json();

  const playlists = items.map((playlist) => ({
    name: playlist.name,
    url: playlist.external_urls.spotify,
    image: playlist.images[0].url,
    tracks: playlist.tracks.total,
    description: playlist.description,
  }));

  const resTopAlbumsThreeMonth = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${process.env.LAST_FM_USER_NAME}&api_key=${process.env.LAST_FM_API_KEY}&limit=${count}&period=1month&format=json`
  );
  const topAlbumThreeMonthQuery = await resTopAlbumsThreeMonth.json();
  const topAlbumsThreeMonth = topAlbumThreeMonthQuery?.topalbums?.album.map(
    (album) => ({
      title: album?.name,
      artist: album?.artist?.name,
      cover: album?.image[3]["#text"] || album?.image[2]["#text"],
      playCount: album?.playcount,
      url: album?.url,
    })
  );

  const resTopAlbumsOverall = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${process.env.LAST_FM_USER_NAME}&api_key=${process.env.LAST_FM_API_KEY}&limit=${count}&period=$overall&format=json`
  );
  const topAlbumOverallQuery = await resTopAlbumsOverall.json();
  const topAlbumOverall = topAlbumOverallQuery?.topalbums?.album.map(
    (album) => ({
      title: album?.name,
      artist: album?.artist?.name,
      cover: album?.image[3]["#text"] || album.image[2]["#text"],
      playCount: album?.playcount,
      url: album?.url,
    })
  );

  return {
    props: {
      topAlbumsThreeMonth,
      topAlbumOverall,
      playlists,
    },
  };
}

const Music = ({ topAlbumsThreeMonth, topAlbumOverall, playlists }) => {
  const [isOverall, setIsOverall] = useState(false);

  return (
    <>
      <PageHeader headline="Music">
        Music is a daily companion for me. To switch off my head after a long
        day, to focus at work or to feel alive at concerts. The data is fetched
        directly from{" "}
        <TextLink src="https://open.spotify.com/user/iamrbn" external>
          Spotify
        </TextLink>{" "}
        and{" "}
        <TextLink src="https://www.last.fm/home" external>
          Last.fm
        </TextLink>
        .
      </PageHeader>
      <p className="font-bold dark:text-grey-200"></p>
      <h2 className="text-text-lvl-1 font-bold mb-8 uppercase mt-24">
        My Playlists
      </h2>
      <div
        className={clsx(
          "grid grid-cols-1 gap-8",
          "xl:grid-cols-2"
        )}
      >
        {playlists?.map((playlist, index) => (
          <PlaylistItem
            key={index}
            title={playlist?.name}
            cover={playlist?.image}
            playCounts={playlist?.playCount}
            url={playlist?.url}
            description={playlist?.description}
          />
        ))}
      </div>
      <div className="mt-24 mb-8 flex items-center">
        <h2 className="text-text-lvl-1 font-bold uppercase">
          Top Albums
        </h2>
        <div className="ml-8 flex gap-2 text-sm">
          <button
            onClick={() => setIsOverall(false)}
            className={clsx(
              "cursor-pointer py-2 px-3 rounded-md text-text-lvl-2",
              !isOverall
                ? "font-bold text-blue bg-blue-100 dark:bg-grey-900 dark:text-blue"
                : ""
            )}
          >
            Past 30 days
          </button>
          <button
            onClick={() => setIsOverall(true)}
            className={clsx(
              "cursor-pointer py-2 px-3 rounded-md text-text-lvl-2",
              isOverall
                ? "font-bold text-blue bg-blue-100 dark:bg-grey-900 dark:text-blue"
                : ""
            )}
          >
            Overall
          </button>
        </div>
      </div>
      <div
        className={clsx(
          "grid grid-cols-1 gap-8",
          "lg:grid-cols-2",
          "xxl:grid-cols-3"
        )}
      >
        {isOverall
          ? topAlbumOverall?.map((album, index) => (
              <MusicItem
                key={index}
                title={album?.title}
                artist={album?.artist}
                cover={album?.cover}
                playCounts={album?.playCount}
                url={album?.url}
              />
            ))
          : topAlbumsThreeMonth?.map((album, index) => (
              <MusicItem
                key={index}
                title={album?.title}
                artist={album?.artist}
                cover={album?.cover}
                playCounts={album?.playCount}
                url={album?.url}
              />
            ))}
      </div>
    </>
  );
};


export default Music;
Music.Layout = "Main";
