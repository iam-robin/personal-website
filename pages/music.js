import useSWR from "swr";
import fetcher from "../lib/fetcher";
import MediaDivider from "../components/MediaDivider";
import PageHeader from "../components/PageHeader";
import MusicItem from "../components/MusicItem";
import PlaylistItem from "../components/PlaylistItem";
import clsx from "clsx";
import TextLink from "../components/TextLink";
import { useState } from 'react';

export async function getServerSideProps() {
  const count = 6;

  const resTopAlbumsThreeMonth = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${process.env.LAST_FM_USER_NAME}&api_key=${process.env.LAST_FM_API_KEY}&limit=${count}&period=3month&format=json`);
  const topAlbumThreeMonthQuery = await resTopAlbumsThreeMonth.json();
  const topAlbumsThreeMonth = topAlbumThreeMonthQuery?.topalbums?.album.map((album) => ({
    title: album?.name,
    artist: album?.artist?.name,
    cover: album?.image[3]['#text'] || album?.image[2]['#text'],
    playCounts: album?.playcount,
    url: album?.url,
  }));

  const resTopAlbumsOverall = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${process.env.LAST_FM_USER_NAME}&api_key=${process.env.LAST_FM_API_KEY}&limit=${count}&period=$overall&format=json`);
  const topAlbumOverallQuery = await resTopAlbumsOverall.json();
  const topAlbumOverall = topAlbumOverallQuery?.topalbums?.album.map((album) => ({
    title: album?.name,
    artist: album?.artist?.name,
    cover: album?.image[3]['#text'] || album.image[2]['#text'],
    playCount: album?.playcount,
    url: album?.url,
  }));

  return {
    props: {
      topAlbumsThreeMonth,
      topAlbumOverall,
    },
  }
};

const Music = ({ topAlbumsThreeMonth, topAlbumOverall }) => {
  const { data: playlists } = useSWR("/api/spotify/playlists", fetcher);
  const [isOverall, setIsOverall] = useState(false);

  return (
    <>
      <PageHeader headline="Music">
        Music is a daily companion for me. To switch off my head after a long day, to focus at work or to feel alive at concerts. The data is fetched directly from <TextLink src="https://open.spotify.com/user/iamrbn" external>Spotify</TextLink> and <TextLink src="https://www.last.fm/home" external>Last.fm</TextLink>.
      </PageHeader>
      <p className="font-bold dark:text-grey-200">
      </p>
      <h2 className="text-black font-bold mb-8 uppercase mt-24 dark:text-grey-700">My Playlists</h2>
      <div>
        {
          playlists?.map((playlist, index) => (
            <PlaylistItem
              key={index}
              title={playlist?.name}
              cover={playlist?.image}
              playCounts={playlist?.playCount}
              url={playlist?.url}
              description={playlist?.description}
            />
          ))
        }
        </div>
      <div className="mt-24 mb-8 flex items-center">
        <h2 className="text-black font-bold  uppercase dark:text-grey-700">Top Albums</h2>
        <div className="ml-8 flex gap-2 text-sm">
          <button
            onClick={() => setIsOverall(false)}
            className={clsx(
              'cursor-pointer py-2 px-3 rounded-md dark:text-grey-500',
              !isOverall ? 'font-bold text-blue bg-blue-100 dark:bg-grey-900 dark:text-blue' : ''
            )}
          >Past 3 month</button>
          <button
            onClick={() => setIsOverall(true)}
            className={clsx(
              'cursor-pointer py-2 px-3 rounded-md dark:text-grey-500',
              isOverall ? 'font-bold text-blue bg-blue-100 dark:bg-grey-900 dark:text-blue' : ''
            )}
          >Overall</button>
        </div>
      </div>
      <div className={clsx(
        "grid grid-cols-1 gap-6",
        "xxs:grid-cols-2",
        "lg:grid-cols-3 lg:gap-10",
      )}>
        {
          isOverall ? (
            topAlbumOverall?.map((album, index) => (
              <MusicItem
                key={index}
                title={album?.title}
                artist={album?.artist}
                cover={album?.cover}
                playCounts={album?.playCount}
                url={album?.url}
              />
            ))
          ) : (
            topAlbumsThreeMonth?.map((album, index) => (
              <MusicItem
                key={index}
                title={album?.title}
                artist={album?.artist}
                cover={album?.cover}
                playCounts={album?.playCount}
                url={album?.url}
              />
            ))
          )
        }
      </div>
    </>
  )
};

Music.layout = "LayoutDefault";

export default Music;
