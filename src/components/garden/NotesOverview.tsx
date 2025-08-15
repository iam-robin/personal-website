import { useEffect, useState } from 'react';
import { colors, NoteCard } from './NoteCard';
import { categoriesWhitelist, type GardenCategory } from 'src/api/github';
import Container from '@components/Container';

interface NotesOverviewProps {
    latestCreatedNotes: any[];
    latestEditedNotes: any[];
    basePath?: string;
    categories?: GardenCategory[];
}

const NotesOverview: React.FC<NotesOverviewProps> = ({
    latestCreatedNotes,
    latestEditedNotes,
    basePath = '',
    categories
}) => {
    const [activeTag, setActiveTag] = useState<'created' | 'edited'>('created');
    const [categoriesWithCounts, setCategoriesWithCounts] = useState<
        { category: string; count: number; color: string }[]
    >([]);

    useEffect(() => {
        if (!categories) return;
        const entryCounts = categoriesWhitelist.map((whitelistCategory) => {
            const category = categories?.find((cat) => cat.name === whitelistCategory);
            return category ? category.object.entries.length : 0;
        });

        const combinedCategories = categoriesWhitelist.map((category, i) => ({
            category,
            count: entryCounts[i],
            color: colors[i]
        }));

        combinedCategories.sort((a, b) => b.count - a.count);

        setCategoriesWithCounts(combinedCategories);
    }, [categories, colors, categoriesWhitelist]);

    return (
        <Container>
            {categories && (
                <div className="mb-20 mt-12">
                    <div className="mb-5 font-bold">Topics</div>
                    <ul className="flex flex-wrap gap-3">
                        {categoriesWithCounts.map((categoryWithCount, i) => (
                            <li
                                className="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-3 py-1"
                                key={i}
                            >
                                <span
                                    style={{ backgroundColor: categoryWithCount.color }}
                                    className="h-2 w-2 rounded-full"
                                ></span>
                                <a href={`/garden/${categoryWithCount.category}`}>
                                    {categoryWithCount.category}
                                </a>
                                <span className="text-neutral-500">
                                    ({categoryWithCount.count})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex items-center gap-3">
                <span className="font-bold">Notes</span>
                <ul className="flex flex-wrap gap-2">
                    <li
                        className={`cursor-pointer rounded px-2 py-1 ${
                            activeTag === 'created'
                                ? 'bg-neutral-100 text-neutral-800'
                                : 'text-neutral-400'
                        }`}
                        onClick={() => setActiveTag('created')}
                    >
                        newest
                    </li>
                    <li
                        className={`cursor-pointer rounded px-2 py-1 ${
                            activeTag === 'edited'
                                ? 'bg-neutral-100 text-neutral-800'
                                : 'text-neutral-400'
                        }`}
                        onClick={() => setActiveTag('edited')}
                    >
                        last edited
                    </li>
                </ul>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 px-2 xs:grid-cols-2 md:grid-cols-3 lg:gap-6">
                {activeTag === 'created' &&
                    latestCreatedNotes?.map((note: any, i) => (
                        <NoteCard
                            data={note}
                            path={`${basePath}/${note.path}`}
                            category={note.path}
                            distorted
                            key={i}
                        />
                    ))}
                {activeTag === 'edited' &&
                    latestEditedNotes?.map((note: any, i) => (
                        <NoteCard
                            data={note}
                            path={`${basePath}/${note.path}`}
                            category={note.path}
                            distorted
                            key={i}
                        />
                    ))}
            </div>
        </Container>
    );
};

export default NotesOverview;
