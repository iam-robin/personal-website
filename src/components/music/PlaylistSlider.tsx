import Slider from '@components/slider/Slider';
import SliderItem from '@components/slider/SliderItem';
import PlaylistItem from './PlaylistItem';
import type { Playlist } from '@components/MusicSection.astro';
import Container from '@components/Container';

interface PlaylistSliderProps {
    playlists: Playlist[];
}

const PlaylistSlider: React.FC<PlaylistSliderProps> = ({ playlists }) => {
    return (
        <div>
            <Container>
                <span className="text-base font-bold">My playlists</span>
            </Container>
            <Slider spacingTop buttonPosition={playlists.length > 3 ? 'bottom' : null}>
                {playlists?.map((playlist: Playlist) => (
                    <SliderItem key={playlist.name}>
                        <PlaylistItem
                            image={playlist.image}
                            name={playlist.name}
                            url={playlist.url}
                            tracks={playlist.tracks}
                            description={playlist.description}
                        />
                    </SliderItem>
                ))}
                <SliderItem emptyEnd />
            </Slider>
        </div>
    );
};

export default PlaylistSlider;
