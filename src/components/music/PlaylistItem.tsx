import type { Playlist } from '@components/MusicSection.astro';
import './album-item.css';

const PlaylistItem: React.FC<Playlist> = ({ image, name, tracks, description, url }) => {
    return (
        <a href={url} className="h-full w-full cursor-pointer">
            <div className="group relative flex w-full items-center justify-center rounded-lg bg-neutral-100 px-4 py-14">
                <div
                    className="h-36 w-36 rounded-sm bg-cover shadow-2xl"
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
            </div>
            <div className="mt-2 text-xs">
                <p className="font-bold text-black-700">{name}</p>
                <p className="text-black-400">{description}</p>
            </div>
        </a>
    );
};

export default PlaylistItem;
