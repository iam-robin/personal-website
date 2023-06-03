import VersionItem from "../components/VersionItem";
import { ArrowSmRightIcon } from "@heroicons/react/outline";

const Changelog = () => {
    return (
        <div className="text-text-lvl-1">
            <h1 className="text-xl mb-12 font-medium">Changelog</h1>
            <ul>
                <VersionItem
                    version="2.2.0"
                    headline="🌈 Themes"
                    date={new Date("2023-04-23T12:00")}
                >
                    <p>
                        I couldn&apos;t decide if I prefer a blue or gray background
                        for my personal website.<br/>The solution: a theme switcher!
                    </p>
                </VersionItem>
                <VersionItem
                    version="2.1.0"
                    headline="🔖 Bookmark page"
                    date={new Date("2023-02-24T11:00")}
                >
                    <p>
                        I have added a new page to the website, where all the
                        articles, websites, videos, and other things I have
                        bookmarked are listed. The data is automatically updated
                        from my Raindrop.io account.
                    </p>
                </VersionItem>
                <VersionItem
                    version="2.0.0"
                    headline="💅 New layout"
                    date={new Date("2023-01-31T13:30")}
                >
                    <p>
                        New layout! The navigation has moved from the top to the
                        right side of the website and was supplemented with a
                        collidable sidebar. There is also a dark-mode, so you
                        don&apos;t have to wear sunglasses at night anymore.
                    </p>
                </VersionItem>
                <VersionItem
                    version="1.2.0"
                    headline="📚 Literal integration"
                    date={new Date("2022-12-19T17:30")}
                >
                    <p>
                        The data for my reading list is now coming directly from
                        the wonderful platform literal.club, as I was clearly
                        too lazy to maintain my reading stats on Notion.
                    </p>
                </VersionItem>
                <VersionItem
                    version="1.1.0"
                    headline="🎸 Add music overview"
                    date={new Date("2022-06-26T17:06")}
                >
                    <p>
                        In addition to an overview of the books I&apos;ve read,
                        there is now also an overview of my favorite music under
                        the media tab. The data comes directly from my Spotify
                        account and updates automatically when I add a new
                        favorite album.
                    </p>
                </VersionItem>
                <VersionItem
                    version="1.0.0"
                    headline="🚀 Hello world"
                    date={new Date("2022-06-19T19:30")}
                >
                    <p>
                        This website went live! It contains all the basic
                        functions that I have planned for the first release: an
                        overview of my side projects, a reading list and a
                        gallery of my photos. The Data for the reading list and
                        photo gallery is based on Notion. The page can be
                        navigated via a command bar and contains a dark theme.
                    </p>
                    <div className="mt-4 space-y-6 sm:space-y-[0] sm:space-x-20 sm:flex">
                        <div>
                            <p className="mt-2 font-medium text-sm">
                                Used tools
                            </p>
                            <ul className="mt-1 list-inside list-disc text-sm">
                                <li className="flex items-center">
                                    <ArrowSmRightIcon className="h-4 w-4 mr-1 text-grey-300 dark:text-grey-400" />
                                    VS Code
                                </li>
                                <li className="flex items-center">
                                    <ArrowSmRightIcon className="h-4 w-4 mr-1 text-grey-300 dark:text-grey-400" />
                                    Figma
                                </li>
                                <li className="flex items-center">
                                    <ArrowSmRightIcon className="h-4 w-4 mr-1 text-grey-300 dark:text-grey-400" />
                                    Notion
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="mt-2 font-medium text-sm">
                                Tech stack
                            </p>
                            <ul className="mt-1 list-inside list-disc text-sm">
                                <li className="flex items-center">
                                    <ArrowSmRightIcon className="h-4 w-4 mr-1 text-grey-300 dark:text-grey-400" />
                                    Next.js
                                </li>
                                <li className="flex items-center">
                                    <ArrowSmRightIcon className="h-4 w-4 mr-1 text-grey-300 dark:text-grey-400" />
                                    Typescript
                                </li>
                                <li className="flex items-center">
                                    <ArrowSmRightIcon className="h-4 w-4 mr-1 text-grey-300 dark:text-grey-400" />
                                    Tailwind
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="mt-2 font-medium text-sm">Hosting</p>
                            <ul className="mt-1 list-inside list-disc text-sm">
                                <li className="flex items-center">
                                    <ArrowSmRightIcon className="h-4 w-4 mr-1 text-grey-300 dark:text-grey-400" />
                                    Github
                                </li>
                                <li className="flex items-center">
                                    <ArrowSmRightIcon className="h-4 w-4 mr-1 text-grey-300 dark:text-grey-400" />
                                    Netlify
                                </li>
                            </ul>
                        </div>
                    </div>
                </VersionItem>
                <VersionItem
                    version="0.0.0"
                    headline="👨🏼‍💻 Initial commit"
                    date={new Date("2022-03-17T18:30")}
                    hasLine={false}
                >
                    <p>
                        The idea to build a website with a larger personal
                        reference is born and the rough project structure based
                        on next.js, typescript and tailwind is set up.
                    </p>
                </VersionItem>
            </ul>
        </div>
    );
};


export default Changelog;
Changelog.Layout = "Main";
