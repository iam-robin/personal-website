import NavItem from "./NavItem";
import Logo from "../public/img/logo.svg";
import Link from "next/link";
import clsx from "clsx";
import ThemeToggle from "./ThemeToggle";

interface MediaDividerProps {
  collided?: boolean;
}

const Sidebar: React.FC<MediaDividerProps> = ({ collided }) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <Link
        href="/"
        className={clsx(
          "flex-row gap-4 hidden",
          "md:flex",
          "short-transition origin-bottom-left",
          collided ? "md:pl-[10px]" : "md:pl-0",
        )}
      >
        <Logo className="fill-blue h-10 w-10 shrink-0" />
        <div
          className={clsx(
            "text-xs flex flex-col justify-center whitespace-nowrap",
            "default-transition origin-bottom-left",
            collided ? "md:opacity-0 md:scale-100" : "md:opacity-100 md:scale-100"
          )}
        >
          <h1 className="text-grey-1000 dark:text-grey-200 font-bold">
            Robin Spielmann
          </h1>
          <h2 className="text-grey-400 dark:text-grey-500">Design engineer</h2>
        </div>
      </Link>
      <nav className="flex flex-col gap-10 mb-10 md:my-10">
        <div>
          <h3
            className={clsx(
              "text-[11px] font-bold text-grey-400 dark:text-grey-600 tracking-wider uppercase whitespace-nowrap",
              "short-transition origin-bottom-left",
              collided ? "md:opacity-0 md:scale-100" : "md:opacity-100 md:scale-100"
            )}
          >
            What I create
          </h3>
          <ul className={clsx("list-none p-0 m-0 -ml-2 mt-2")}>
            <NavItem content="projects" route="/projects" onlyIcon={collided} />
            {/* <NavItem content="blog" route="/blog" onlyIcon={collided} /> */}
            <NavItem content="photos" route="/photos" onlyIcon={collided} />
          </ul>
        </div>
        <div>
          <h3
            className={clsx(
              "text-[11px] font-bold text-grey-400 dark:text-grey-600 tracking-wider uppercase whitespace-nowrap",
              "short-transition origin-bottom-left",
              collided ? "md:opacity-0 md:scale-100" : "md:opacity-100 md:scale-100"
            )}
          >
            What I consume
          </h3>
          <ul className="list-none p-0 m-0 -ml-2 mt-2">
            <NavItem content="books" route="/books" onlyIcon={collided} />
            <NavItem content="music" route="/music" onlyIcon={collided} />
          </ul>
        </div>
        <div>
          <h3
            className={clsx(
              "text-[11px] font-bold text-grey-400 dark:text-grey-600 tracking-wider uppercase whitespace-nowrap",
              "short-transition origin-bottom-left",
              collided ? "md:opacity-0 md:scale-100" : "md:opacity-100 md:scale-100"
            )}
          >
            where to find me
          </h3>
          <ul className="list-none p-0 m-0 -ml-2 mt-2">
            {/* <NavItem
                content="twitter"
                route="https://twitter.com/iamrob_in"
                onlyIcon={collided}
                small
              /> */}
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
              content="instagram"
              route="https://www.instagram.com/iamrob.in/"
              onlyIcon={collided}
              small
            />
            <NavItem
              content="readcv"
              route="https://read.cv/iamrobin"
              onlyIcon={collided}
              small
            />
          </ul>
        </div>
      </nav>
      <nav className="flex items-center md:items-start gap-5 md:gap-1 md:flex-col">
        <span className={clsx(
            "flex transition-[padding] duration-[700ms] ease-in-out",
            collided ? "md:pl-4" : "md:pl-0",
        )}>
            <ThemeToggle />
        </span>
        <ul
          className={clsx(
            "text-xs flex text-grey-600 dark:text-grey-700 flex-row md:flex-col gap-4 md:gap-1 md:mt-3",
          )}
        >
          <li>
            <Link href="/legals" className={clsx(
                "transition-[padding] duration-[700ms] ease-in-out",
                collided ? "md:pl-2" : "md:pl-0"
            )}>
              Legals
            </Link>
          </li>
          <li>
            <Link href="/changelog" className="">
              Changelog
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
