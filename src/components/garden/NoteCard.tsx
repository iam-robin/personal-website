import { categoriesWhitelist, parseMarkdownContent } from 'src/api/github';
import { formatDate } from 'src/utils/formatDate';

interface NoteCardProps {
    data: any;
    path: string;
    category: string;
    distorted?: boolean;
}

export const colors = [
    '#9EAAFA',
    '#FAE680',
    '#A2CBAF',
    '#E8ADB1',
    '#A6C2EB',
    '#F4E8C8',
    '#CCA7ED',
    '#F29874',
    '#6C95CF',
    '#F4DAA0'
];

export const NoteCard: React.FC<NoteCardProps> = ({
    data,
    path: currentPath,
    distorted,
    category
}) => {
    const isDraft = !data.body || data.body.trim() === '' || data.body.trim() === 'TBD';

    const charCount = data.frontmatter?.description.length;

    const getFontSize = (count: number) => {
        const minFontSize = 1.5;
        const maxFontSize = 2.5;
        const maxCharCount = 50;

        const fontSize = Math.min(
            maxFontSize,
            Math.max(
                minFontSize,
                maxFontSize - (count / maxCharCount) * (maxFontSize - minFontSize)
            )
        );
        return `${fontSize.toFixed(2)}rem`;
    };

    const typeFontSize = getFontSize(charCount);

    const createdDay = formatDate(data.frontmatter?.created);
    const editedDay = formatDate(data.frontmatter?.edited);

    const categoryIndex = categoriesWhitelist.indexOf(category);
    const backgroundColor = colors[categoryIndex];

    const randomMarginBottom = Math.floor(Math.random() * 8);
    const randomMarginRight = Math.floor(Math.random() * 8);
    const randomRotation = Math.floor(Math.random() * 4 - 2);
    const randomTypeMarginBottom = Math.floor(Math.random() * 12 - 6);
    const randomTypeRotation = Math.floor(Math.random() * 4 - 2);
    const randomTypeMarginRight = Math.floor(Math.random() * 12 - 6);

    const transformStyles = distorted
        ? {
              transform: `translateY(${randomMarginBottom}px) translateX(${randomMarginRight}px) rotate(${randomRotation}deg)`
          }
        : {
              transform: `rotate(${randomRotation}deg)`
          };

    const backgroundColorStyle = {
        backgroundColor: backgroundColor
    };

    const getTextAlignment = (charCount: number) => {
        if (charCount < 50) {
            return 'text-center';
        } else {
            return 'text-left';
        }
    };

    const textAlignmentClass = getTextAlignment(charCount);

    const content = (
        <>
            <div className="texture"></div>
            <div className="flex h-full flex-col justify-between border p-3 font-mono">
                <div>
                    <ul className="flex gap-2">
                        <li className="mb-2 inline-block rounded-full border px-2 py-[2px] text-[11px]">
                            {category}
                        </li>
                        {isDraft && (
                            <li className="mb-2 inline-block rounded-full border px-2 py-[2px] text-[11px]">
                                Draft
                            </li>
                        )}
                    </ul>
                    <h3 className="mt-3 text-base font-bold">{data.name.replace(/\.md$/, '')}</h3>
                </div>
                {data.frontmatter?.description && (
                    <div>
                        <div className="my-1 truncate text-clip font-mono text-base tracking-widest text-black">
                            ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        </div>
                        <p
                            className={`line-clamp-3 py-1 ${textAlignmentClass} font-script text-md leading-[1.1] opacity-70`}
                            style={{
                                filter: 'url(#distort)',
                                fontSize: typeFontSize,
                                transform: `translateY(${randomTypeMarginBottom}px) translateX(${randomTypeMarginRight}px) rotate(${randomTypeRotation}deg)`,
                                fontFeatureSettings: '"liga", "ss01", "ss02", "ss03"'
                            }}
                        >
                            {data.frontmatter.description}
                        </p>
                    </div>
                )}
                <div className="text-[12px]">
                    <div className="my-1 truncate text-clip font-mono text-base tracking-widest text-black">
                        ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    </div>
                    <p>
                        <span className="inline-block min-w-[72px]">created:</span> {createdDay}
                    </p>
                    {createdDay !== editedDay && (
                        <p>
                            <span className="inline-block min-w-[72px]">edited:</span> {editedDay}
                        </p>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <div className="group flex h-full min-h-[280px] items-center">
            <div
                className={`noteCardEffect w-full ${
                    randomRotation >= 0 ? 'hide-after' : 'hide-before'
                }`}
                style={transformStyles}
            >
                {isDraft ? (
                    <div className="relative cursor-not-allowed p-2" style={backgroundColorStyle}>
                        {content}
                    </div>
                ) : (
                    <a
                        className="relative block p-2 transition-all hover:scale-105 hover:shadow-md"
                        href={`${currentPath}/${data.name}`}
                        style={backgroundColorStyle}
                    >
                        {content}
                    </a>
                )}
            </div>
        </div>
    );
};
