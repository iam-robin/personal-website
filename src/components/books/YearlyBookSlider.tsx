import { useEffect, useState } from 'react';
import type { Shelf } from './BookSection.astro';
import Slider from '@components/slider/Slider';
import SliderItem from '@components/slider/SliderItem';
import BookItem from './BookItem';
import Container from '@components/Container';

interface YearlyBookSliderProps {
    shelfs: Shelf[];
    gardenBookEntries: string[];
}

const hasBookEntryInGarden = (title: string, author: string, gardenEntries: string[]) => {
    return gardenEntries.some((entry) => entry.includes(title) && entry.includes(author));
};

const YearlyBookSlider: React.FC<YearlyBookSliderProps> = ({ shelfs, gardenBookEntries }) => {
    const [activeShelf, setActiveShelf] = useState<number>(0);

    return (
        <div>
            <Container classes="mb-2 lg:mb-8 flex flex-col md:flex-row md:items-center gap-3 pt-4">
                <span className="font-bold">Books read in</span>
                <ul className=" flex flex-wrap gap-2">
                    {shelfs?.map((shelf: Shelf, index: number) => (
                        <li
                            key={index}
                            onClick={() => setActiveShelf(index)}
                            className={`cursor-pointer rounded px-2 py-1 ${
                                activeShelf === index
                                    ? 'bg-neutral-100 text-neutral-800'
                                    : 'text-neutral-400'
                            }`}
                        >
                            {shelf.title}
                            <sup> {shelf.books.length}</sup>
                        </li>
                    ))}
                </ul>
            </Container>
            <Slider
                spacingTop
                classes={shelfs[activeShelf].books.length > 3 ? 'lg:-mt-[68px]' : ''}
                buttonPosition={shelfs[activeShelf].books.length > 3 ? 'top' : null}
            >
                {shelfs[activeShelf].books.map((book) => (
                    <SliderItem key={book.title}>
                        <BookItem
                            cover={book.cover}
                            title={book.title}
                            authors={book.authors}
                            currentlyReading={book.currentlyReading}
                            rating={book.review?.rating}
                            link={book.slug}
                            hasGardenEntry={hasBookEntryInGarden(
                                book.title,
                                book.authors[0].name,
                                gardenBookEntries
                            )}
                        />
                    </SliderItem>
                ))}
                <SliderItem emptyEnd />
            </Slider>
        </div>
    );
};

export default YearlyBookSlider;
