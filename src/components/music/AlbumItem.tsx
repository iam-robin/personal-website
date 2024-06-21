import './album-item.css';

interface AlbumItemProps {
    cover: string;
    title: string;
    artist: string;
    playCount: string;
    link?: string;
}

const AlbumItem: React.FC<AlbumItemProps> = ({ cover, title, artist, playCount, link }) => {
    const discColorClass = `disc-color-${Math.floor(Math.random() * 7)}`;

    return (
        <a href={link} className="h-full w-full cursor-pointer">
            <div className="music-item group relative flex w-full items-center rounded-lg bg-neutral-100 px-4 py-14">
                <div className="album-container">
                    {/* <span className="absolute right-2 top-2 flex flex-row items-center gap-1 rounded-md bg-lilac-light px-2 py-1 font-mono text-2xs">
                        <span>{playCount} plays</span>
                        <Icon name="ph:play-circle-bold" width={16} />
                    </span> */}
                    <div className="album-wrap">
                        <div className="album" style={{ backgroundImage: `url(${cover})` }}></div>
                        <div className={`disk ${discColorClass}`}>
                            <div className="disk__inside"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2 text-xs">
                <p className="font-bold text-black-700">{title}</p>
                <p className="text-black-400">{artist}</p>
            </div>
        </a>
    );
};

export default AlbumItem;
