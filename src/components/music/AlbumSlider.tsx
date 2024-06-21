import { useEffect, useState } from 'react';
import Slider from '@components/slider/Slider';
import SliderItem from '@components/slider/SliderItem';
import AlbumItem from './AlbumItem';
import Container from '@components/Container';

interface YearlyBookSliderProps {
    albums: any;
}

const AlbumSlider: React.FC<YearlyBookSliderProps> = ({ albums }) => {
    const [activeFilter, setActiveFilter] = useState<'overall' | 'threeMonth'>('threeMonth');

    return (
        <div>
            <Container classes="mb-2 flex items-center gap-3">
                <span className="font-bold">Top albums</span>
                <ul className=" flex gap-2">
                    <li
                        onClick={() => setActiveFilter('threeMonth')}
                        className={`cursor-pointer rounded px-2 py-1 ${
                            activeFilter === 'threeMonth'
                                ? 'bg-lilac-light text-lilac-dark'
                                : 'text-neutral-400'
                        }`}
                    >
                        last 30 days
                    </li>
                    <li
                        onClick={() => setActiveFilter('overall')}
                        className={`cursor-pointer rounded px-2 py-1 ${
                            activeFilter === 'overall'
                                ? 'bg-lilac-light text-lilac-dark'
                                : 'text-neutral-400'
                        }`}
                    >
                        overall
                    </li>
                </ul>
            </Container>
            <Slider
                spacingTop
                classes="-mt-[68px]"
                buttonPosition={albums?.[activeFilter].length > 3 ? 'top' : null}
            >
                {albums?.[activeFilter].map((album: any) => (
                    <SliderItem key={album.title}>
                        <AlbumItem
                            cover={album.cover}
                            title={album.title}
                            artist={album.artist}
                            playCount={album.playCount}
                        />
                    </SliderItem>
                ))}
                <SliderItem emptyEnd />
            </Slider>
        </div>
    );
};

export default AlbumSlider;
