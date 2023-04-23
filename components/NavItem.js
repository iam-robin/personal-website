import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CameraIcon from "../public/img/icons/camera.svg";
import CameraFilledIcon from "../public/img/icons/cameraFilled.svg";
import FolderIcon from "../public/img/icons/folder.svg";
import FolderFilledIcon from "../public/img/icons/folderFilled.svg";
import BookIcon from "../public/img/icons/book.svg";
import BookFilledIcon from "../public/img/icons/bookFilled.svg";
import BookmarkIcon from "../public/img/icons/bookmark.svg";
import BookmarkFilledIcon from "../public/img/icons/bookmarkFilled.svg";
import MusicIcon from "../public/img/icons/music.svg";
import MusicFilledIcon from "../public/img/icons/musicFilled.svg";
import WriteIcon from "../public/img/icons/write.svg";
import WriteFilledIcon from "../public/img/icons/writeFilled.svg";
import TwitterIcon from "../public/img/icons/twitter.svg";
import MastodonIcon from "../public/img/icons/mastodon.svg";
import InstagramIcon from "../public/img/icons/instagram.svg";
import GithubIcon from "../public/img/icons/github.svg";
import ReadcvIcon from "../public/img/icons/readcv.svg";
import GlassIcon from "../public/img/icons/glass.svg";
import ArrowUpRightIcon from "../public/img/icons/arrowUpRight.svg";
import clsx from "clsx";
import { publish } from "../lib/events";

const getActiveRoute = (router) => {
    return "/" + router.pathname.split("/")[1];
};

const NavItem = (props) => {
    const router = useRouter();
    const [activeRoute, setActiveRoute] = useState(getActiveRoute(router));

    const iconMap = {
        photos: {
            active: CameraFilledIcon,
            inactive: CameraIcon,
        },
        projects: {
            active: FolderFilledIcon,
            inactive: FolderIcon,
        },
        books: {
            active: BookFilledIcon,
            inactive: BookIcon,
        },
        music: {
            active: MusicFilledIcon,
            inactive: MusicIcon,
        },
        bookmarks: {
            active: BookmarkFilledIcon,
            inactive: BookmarkIcon,
        },
        blog: {
            active: WriteFilledIcon,
            inactive: WriteIcon,
        },
        twitter: {
            inactive: TwitterIcon,
        },
        mastodon: {
            inactive: MastodonIcon,
        },
        instagram: {
            inactive: InstagramIcon,
        },
        github: {
            inactive: GithubIcon,
        },
        readcv: {
            inactive: ReadcvIcon,
        },
        glass: {
            inactive: GlassIcon,
        },
    };

    const IconInactive = iconMap[props.content]?.inactive;
    const IconActive = iconMap[props.content]?.active;

    useEffect(() => {
        setActiveRoute(getActiveRoute(router));

        const handleKeyPress = (event) => {
            if (event.key === props.index) {
                router.push(props.route);
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [router, props.index, props.route]);

    return (
        <li className={clsx("block text-base group")}>
            <Link
                href={props.route}
                rel="me"
                onClick={() => publish("navItemClicked")}
                className={clsx(
                    `flex relative px-3 rounded-lg items-center justify-between pointer text-sm group text-nav-text-lvl-1`,
                    'after:block after:content-[""] after:-z-10 after:absolute after:top-[0] after:left-[0] after:w-full after:h-full after:rounded-lg',
                    "after:opacity-0 after:scale-90 after:transition-all after:duration-300 after:ease-in-out",
                    "hover:after:opacity-100 hover:after:scale-100",
                    "md:transition-all md:duration-[500ms] md:ease-in-out",
                    props.onlyIcon ? "md:mr-2 md:ml-4" : "md:mr-0",
                    props.onlyIcon && activeRoute != props.route
                        ? "hover:after:opacity-0"
                        : "",
                    props.small ? "text-xs py-2" : "text-base py-[8px]",
                    activeRoute == props.route
                        ? "after:scale-100 after:transition-color after:duration-[0ms] after:opacity-100 after:bg-nav-bg-lvl-1"
                        : "after:bg-nav-bg-lvl-2"
                )}
            >
                {props.onlyIcon && (
                    <div
                        className={clsx(
                            "hidden md:block fixed text-text-lvl-1 opacity-0 scale-90 pointer-events-none origin-left -translate-x-2 left-[72px] z-50 px-3 py-[6px] rounded-xl font-normal bg-bg-lvl-4",
                            "transition-[opacity,transform] duration-[300ms] ease-in-out",
                            "group-hover:opacity-100 group-hover:translate-x-[0] group-hover:scale-100"
                        )}
                    >
                        {props.content.charAt(0).toUpperCase() +
                            props.content.slice(1)}
                    </div>
                )}
                <div className={clsx("flex items-center")}>
                    {IconInactive && (
                        <IconInactive
                            className={clsx(
                                "fill-nav-icon-inactive",
                                "transition-all duration-[500ms] ease-in-out",
                                props.onlyIcon & !props.small
                                    ? "md:h-6 md:w-6"
                                    : "",
                                props.small & !props.onlyIcon
                                    ? "h-4 w-4"
                                    : "h-4 w-4",
                                activeRoute == props.route ? "hidden" : "block"
                            )}
                        />
                    )}
                    {IconActive && (
                        <IconActive
                            className={clsx(
                                "fill-nav-icon-active",
                                "transition-all duration-[500ms] ease-in-out",
                                props.onlyIcon & !props.small
                                    ? "md:h-6 md:w-6"
                                    : "",
                                props.small & !props.onlyIcon
                                    ? "h-4 w-4"
                                    : "h-4 w-4",
                                activeRoute == props.route ? "block" : "hidden"
                            )}
                        />
                    )}
                    <span
                        className={clsx(
                            "text-sm origin-bottom-left ml-2 md:transition-[opacity] md:duration-[500ms] md:ease-in-out",
                            activeRoute == props.route
                                ? "font-bold"
                                : "font-normal",
                            props.onlyIcon ? "md:opacity-0" : "opacity-100"
                        )}
                    >
                        {props.content.charAt(0).toUpperCase() +
                            props.content.slice(1)}
                    </span>
                </div>
                {props.route.startsWith("https://") && (
                    <ArrowUpRightIcon
                        className={clsx(
                            "h-2 w-2 fill-nav-text-lvl-3",
                            "default-transition",
                            props.onlyIcon ? "md:opacity-0" : "md:opacity-100"
                        )}
                    />
                )}
                {!props.route.startsWith("https://") && props.index && (
                    <div
                        className={clsx(
                            "hidden h-4 w-4 bg-nav-hotkey-bg rounded text-nav-hotkey-text text-[10px] md:flex items-center justify-center font-mono",
                            activeRoute === props.route &&
                                "!bg-nav-hotkey-bg-active",
                            props.onlyIcon ? "md:opacity-0" : "md:opacity-100"
                        )}
                    >
                        {props.index}
                    </div>
                )}
            </Link>
        </li>
    );
};

export default NavItem;
