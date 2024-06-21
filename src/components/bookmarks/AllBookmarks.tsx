import { useEffect, useState } from 'react';
import type { Bookmark } from './BookmarkItem.astro';
import BookmarkItem from './BookmarkItem';

interface Tag {
    name: string;
    count: number;
}

interface AllBookmarksProps {
    bookmarks: Bookmark[];
    tags: Tag[];
}

const AllBookmarks: React.FC<AllBookmarksProps> = ({ bookmarks, tags }) => {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const handleTagClick = (tagName: string) => {
        if (activeTag === tagName) {
            setActiveTag(null);
        } else {
            setActiveTag(tagName);
        }
    };

    const filteredBookmarks = activeTag
        ? bookmarks.filter((bookmark) => bookmark.tags.includes(activeTag))
        : bookmarks;

    return (
        <div>
            <ul className="flex flex-wrap gap-2">
                {tags.map((tag: Tag) => (
                    <li
                        key={tag.name}
                        className={`flex cursor-pointer gap-2 rounded-full border border-neutral-200 px-4 py-1.5 text-2xs text-black-900 ${
                            activeTag === tag.name
                                ? 'border-lilac-light bg-lilac-light text-lilac-dark'
                                : ''
                        }`}
                        onClick={() => handleTagClick(tag.name)}
                    >
                        <span>{tag.name}</span>
                        <span>{tag.count}</span>
                    </li>
                ))}
            </ul>
            <ul className="mb-40 mt-16">
                {filteredBookmarks.map((bookmark: Bookmark) => (
                    <BookmarkItem bookmark={bookmark} key={bookmark.title} />
                ))}
            </ul>
        </div>
    );
};

export default AllBookmarks;
