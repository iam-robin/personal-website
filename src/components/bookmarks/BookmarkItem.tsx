import { useEffect, useRef } from 'react';
import type { Bookmark } from './BookmarkItem.astro';

interface BookmarkItemProps {
    bookmark: Bookmark;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark }) => {
    const date = new Date(bookmark.created);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const url = new URL(bookmark.link);
    const domain = url.hostname;

    const coverRef = useRef<HTMLImageElement | null>(null);
    const itemRef = useRef<HTMLLIElement | null>(null);

    useEffect(() => {
        const coverDistance = 16;
        const positionCover = (event: MouseEvent, item: HTMLLIElement, cover: HTMLImageElement) => {
            const rect = item.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            cover.style.left = `${x + coverDistance}px`;
            cover.style.top = `${y - cover.offsetHeight - coverDistance}px`;
        };

        const handleMouseOver = (event: MouseEvent) => {
            if (itemRef.current && coverRef.current) {
                positionCover(event, itemRef.current, coverRef.current);
                document.querySelectorAll('.bookmark-item').forEach((otherItem) => {
                    if (otherItem !== itemRef.current) {
                        otherItem.classList.add('opacity-20');
                    }
                });
            }
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (itemRef.current && coverRef.current) {
                positionCover(event, itemRef.current, coverRef.current);
            }
        };

        const handleMouseOut = () => {
            if (coverRef.current) {
                coverRef.current.style.left = 'auto';
                coverRef.current.style.top = 'auto';
                document.querySelectorAll('.bookmark-item').forEach((otherItem) => {
                    otherItem.classList.remove('opacity-20');
                });
            }
        };

        const item = itemRef.current;
        if (item) {
            item.addEventListener('mouseover', handleMouseOver);
            item.addEventListener('mousemove', handleMouseMove);
            item.addEventListener('mouseout', handleMouseOut);

            return () => {
                item.removeEventListener('mouseover', handleMouseOver);
                item.removeEventListener('mousemove', handleMouseMove);
                item.removeEventListener('mouseout', handleMouseOut);
            };
        }
    }, []);

    return (
        <li className="bookmark-item group relative" ref={itemRef}>
            <a href={bookmark.link} className="flex items-center justify-between gap-4 py-2">
                <img
                    className="cover-image max-w-64 pointer-events-none absolute z-10 hidden max-h-40 shadow-lg group-hover:block"
                    src={bookmark.cover}
                    ref={coverRef}
                />
                <div className="flex max-w-[80%] shrink-0 items-center gap-2">
                    <div
                        className={`h-2 w-2 rounded-full ${
                            bookmark.type === 'article'
                                ? 'bg-green'
                                : bookmark.type === 'video'
                                  ? 'bg-blue'
                                  : bookmark.type === 'link'
                                    ? 'bg-lilac'
                                    : 'bg-red'
                        }`}
                    ></div>
                    <p className="mr-2 truncate font-mono text-sm">{bookmark.title}</p>
                    <div>
                        {bookmark.tags.length > 0 && (
                            <div className="flex gap-1 ">
                                {bookmark.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="shrink-0 rounded-full bg-black-30 px-2 py-0.5 text-2xs text-black-600"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="h-[1px] w-full grow bg-neutral-200"></div>
                <p className="shrink-0 text-right font-mono text-xs text-neutral-500 group-hover:hidden">
                    {formattedDate}
                </p>
                <div className="hidden shrink-0 items-center gap-2 group-hover:flex">
                    <p className="text-sm">{domain}</p>
                    {/* <Icon name="ph:arrow-up-right-bold" width={16} /> */}
                </div>
            </a>
        </li>
    );
};

export default BookmarkItem;
