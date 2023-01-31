import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CameraIcon from "../public/img/icons/camera.svg";
import CameraFilledIcon from "../public/img/icons/cameraFilled.svg";
import FolderIcon from "../public/img/icons/folder.svg";
import FolderFilledIcon from "../public/img/icons/folderFilled.svg";
import BookIcon from "../public/img/icons/book.svg";
import BookFilledIcon from "../public/img/icons/bookFilled.svg";
import MusicIcon from "../public/img/icons/music.svg";
import MusicFilledIcon from "../public/img/icons/musicFilled.svg";
import WriteIcon from "../public/img/icons/write.svg";
import WriteFilledIcon from "../public/img/icons/writeFilled.svg";
import TwitterIcon from "../public/img/icons/twitter.svg";
import MastodonIcon from "../public/img/icons/mastodon.svg";
import InstagramIcon from "../public/img/icons/instagram.svg";
import GithubIcon from "../public/img/icons/github.svg";
import ReadcvIcon from "../public/img/icons/readcv.svg";
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
  };

  const IconInactive = iconMap[props.content]?.inactive;
  const IconActive = iconMap[props.content]?.active;

  useEffect(() => {
    setActiveRoute(getActiveRoute(router));
  }, [router]);

  return (
    <li
      className={clsx(
        "block text-base group",
        props.small ? "h-8" : "h-10"
      )}
    >
      <Link
        href={props.route}
        onClick={() => publish("navItemClicked")}
        className={clsx(
          `flex relative px-3 rounded-lg items-center justify-between pointer text-sm group`,
          'after:block after:content-[""] after:-z-10 after:absolute after:top-[0] after:left-[0] after:w-full after:h-full after:rounded-xl',
          "after:opacity-0 after:scale-90 after:transition-all after:duration-300 after:ease-in-out",
          "hover:after:opacity-100 hover:after:scale-100",
          "md:transition-all md:duration-[500ms] md:ease-in-out",
          props.onlyIcon ? "md:mr-2 md:ml-4" : "md:mr-0",
          props.onlyIcon && activeRoute != props.route
            ? "hover:after:opacity-0"
            : "",
          props.small ? "text-xs py-2" : "text-base py-[6px]",
          `${
            activeRoute == props.route
              ? "after:scale-100 after:transition-color after:duration-[0ms] after:opacity-100 text-grey-900 dark:text-grey-200 after:bg-grey-200 md:after:bg-white dark:after:bg-grey-900"
              : "text-grey-900 after:bg-grey-100 md:after:bg-grey-200 dark:text-grey-200 dark:after:bg-grey-950"
          }`
        )}
      >
        {props.onlyIcon && (
          <div className="fixed hidden group-hover:block left-[72px] z-50 px-3 py-[6px] rounded-xl font-normal bg-grey-200 dark:bg-grey-900">
            {props.content.charAt(0).toUpperCase() + props.content.slice(1)}
          </div>
        )}
        <div className={clsx("flex items-center")}>
          {IconInactive && (
            <IconInactive
              className={clsx(
                "fill-grey-800 dark:fill-grey-400",
                "transition-all duration-[500ms] ease-in-out",
                props.onlyIcon & !props.small ? "md:h-6 md:w-6" : "",
                props.small & !props.onlyIcon ? "h-4 w-4" : "h-5 w-5",
                activeRoute == props.route ? "hidden" : "block"
              )}
            />
          )}
          {IconActive && (
            <IconActive
              className={clsx(
                "h-5 w-5 fill-blue",
                "transition-all duration-[500ms] ease-in-out",
                props.onlyIcon & !props.small ? "md:h-6 md:w-6" : "",
                props.small & !props.onlyIcon ? "h-4 w-4" : "h-5 w-5",
                activeRoute == props.route ? "block" : "hidden"
              )}
            />
          )}
          <span
            className={clsx(
              "origin-bottom-left ml-3 md:transition-all md:duration-[500ms] md:ease-in-out",
              activeRoute == props.route ? "font-bold" : "font-normal",
              props.onlyIcon ? "md:opacity-0" : "opacity-100"
            )}
          >
            {props.content.charAt(0).toUpperCase() + props.content.slice(1)}
          </span>
        </div>
        {props.route.startsWith("https://") && (
          <ArrowUpRightIcon
            className={clsx(
              "h-2 w-2 fill-grey-300 dark:fill-grey-650",
              "default-transition",
              props.onlyIcon ? "md:opacity-0" : "md:opacity-100"
            )}
          />
        )}
      </Link>
    </li>
  );
};

export default NavItem;
