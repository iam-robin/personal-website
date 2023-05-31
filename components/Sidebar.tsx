import NavItem from "./NavItem";
import Logo from "../public/img/logo.svg";
import Link from "next/link";
import clsx from "clsx";
import ThemeToggle from "./ThemeToggle";

interface SidebarProps {
    collided?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collided }) => {
    return (
        <div className="flex flex-col justify-between h-full">
            <Link
                href="/"
                className={clsx(
                    "flex-row gap-4 hidden",
                    "md:flex",
                    "short-transition origin-bottom-left",
                    collided ? "md:pl-[10px]" : "md:pl-0"
                )}
            >
                <Logo className="fill-nav-fill-logo h-10 w-10 shrink-0" />
                <div
                    className={clsx(
                        "text-xs flex flex-col justify-center whitespace-nowrap",
                        "default-transition origin-bottom-left",
                        collided
                            ? "md:opacity-0 md:scale-100"
                            : "md:opacity-100 md:scale-100"
                    )}
                >
                    <h1 className="text-nav-text-lvl-1 font-bold">
                        Robin Spielmann
                    </h1>
                    <h2 className="text-nav-text-lvl-2">Design Engineer</h2>
                </div>
            </Link>
            <nav className="flex flex-col gap-10 mb-10 md:my-10">
                <div>
                    <h3
                        className={clsx(
                            "text-[11px] font-bold text-nav-text-lvl-3 tracking-wider uppercase whitespace-nowrap",
                            "short-transition origin-bottom-left",
                            collided
                                ? "md:opacity-0 md:scale-100"
                                : "md:opacity-100 md:scale-100"
                        )}
                    >
                        What I create
                    </h3>
                    <ul className={clsx("list-none p-0 m-0 -ml-2 mt-2")}>
                        <NavItem
                            content="projects"
                            route="/projects"
                            onlyIcon={collided}
                            index="1"
                        />
                        {/* <NavItem content="writing" route="/blog" onlyIcon={collided} index={2} /> */}
                        <NavItem
                            content="photography"
                            route="/photos"
                            onlyIcon={collided}
                            index="2"
                        />
                    </ul>
                </div>
                <div>
                    <h3
                        className={clsx(
                            "text-[11px] font-bold text-nav-text-lvl-3 tracking-wider uppercase whitespace-nowrap",
                            "short-transition origin-bottom-left",
                            collided
                                ? "md:opacity-0 md:scale-100"
                                : "md:opacity-100 md:scale-100"
                        )}
                    >
                        What I consume
                    </h3>
                    <ul className="list-none p-0 m-0 -ml-2 mt-2">
                        <NavItem
                            content="books"
                            route="/books"
                            onlyIcon={collided}
                            index="3"
                        />
                        <NavItem
                            content="music"
                            route="/music"
                            onlyIcon={collided}
                            index="4"
                        />
                        <NavItem
                            content="bookmarks"
                            route="/bookmarks"
                            onlyIcon={collided}
                            index="5"
                        />
                    </ul>
                </div>
                <div>
                    <h3
                        className={clsx(
                            "text-[11px] font-bold text-nav-text-lvl-3 tracking-wider uppercase whitespace-nowrap",
                            "short-transition origin-bottom-left",
                            collided
                                ? "md:opacity-0 md:scale-100"
                                : "md:opacity-100 md:scale-100"
                        )}
                    >
                        where to find me
                    </h3>
                    <ul className="list-none p-0 m-0 -ml-2 mt-2">
                        <NavItem
                            content="mastodon"
                            route="https://mastodon.social/@iamrobin"
                            onlyIcon={collided}
                            small
                        />
                        <NavItem
                            content="github"
                            route="https://github.com/iam-robin"
                            onlyIcon={collided}
                            small
                        />
                        <NavItem
                            content="readcv"
                            route="https://read.cv/iamrobin"
                            onlyIcon={collided}
                            small
                        />
                        <NavItem
                            content="glass"
                            route="https://glass.photo/iamrobin"
                            onlyIcon={collided}
                            small
                        />
                    </ul>
                </div>
            </nav>
            <nav className="flex flex-col items-start gap-5 md:gap-3">
                <ul
                    className={clsx(
                        "text-xs flex text-nav-text-lvl-1 gap-4 md:mt-3 md:ml-1",
                        collided ? "flex-col" : "flex-row"
                    )}
                >
                    <li>
                        <Link
                            href="/legals"
                            className={clsx(
                                "transition-[padding] duration-[700ms] ease-in-out",
                                collided ? "md:pl-2" : "md:pl-0"
                            )}
                        >
                            Legals
                        </Link>
                    </li>
                    <li>
                        <Link href="/changelog" className="">
                            Changelog
                        </Link>
                    </li>
                </ul>
                <ThemeToggle isCollided={collided} />
            </nav>
        </div>
    );
};

export default Sidebar;
