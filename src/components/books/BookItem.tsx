import { useEffect, useRef, useState } from 'react';
import badge from '../../assets/shape-sticker-lilac.svg';
import type { Author } from './BookSection.astro';
import './book-item.css';

interface BookItemProps {
    cover: string;
    title?: string;
    authors?: Author[];
    currentlyReading?: boolean;
    link?: string;
}

const BookItem: React.FC<BookItemProps> = ({ cover, title, authors, currentlyReading, link }) => {
    return (
        <a href={`https://literal.club/book/${link}`} className="h-full w-full">
            <div className="book-item group relative flex w-full cursor-pointer flex-col items-center gap-5 rounded-lg bg-neutral-100 px-4 py-14">
                {currentlyReading && (
                    <span
                        style={{ backgroundImage: `url(${badge.src})` }}
                        className="absolute -right-4 -top-4 flex h-20 w-20 rotate-12 items-center justify-center rounded-full bg-cover bg-no-repeat text-center text-2xs leading-4 text-lilac-dark transition-all duration-300 group-hover:rotate-[18deg] group-hover:scale-105"
                    >
                        currently reading
                    </span>
                )}
                <div className="book self-center">
                    <div className="book-cover" style={{ backgroundImage: `url(${cover})` }}>
                        <div className="effect"></div>
                        <div className="light"></div>
                    </div>
                    <div className="book-inside"></div>
                </div>
            </div>
            <div className="mt-2 text-xs">
                <p className="font-bold text-black-700">{title}</p>
                <p className="text-black-400">{authors?.map((author) => author.name).join(', ')}</p>
            </div>
        </a>
    );
};

export default BookItem;
