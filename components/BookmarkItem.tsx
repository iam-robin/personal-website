import clsx from "clsx";

interface BookmarkItemProps {
  title: string;
  date: string;
  tags: string[];
  url: string;
  type: string;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({
  title,
  date,
  tags,
  url,
  type,
}) => {
  const dateFormated = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const dateMobile = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const urlObject = new URL(url);
  return (
    <li
      className={clsx(
        "relative py-3 cursor-pointer",
        "group-hover:opacity-25 hover:!opacity-100 transition-opacity duration-[300ms] ease-in-out",
        "after:content-['↗'] after:absolute after:text-grey-800 dark:after:text-grey-200 after:-right-6 after:-translate-x-2 after:group-hover:-translate-x-2 hover:after:!translate-x-[0] after:top-[11px] after:opacity-0 after:group-hover:opacity-0 after:hover:!opacity-100 after:transition-all after:duration-300 after:ease-in-out"
      )}
    >
      <a href={url}>
        <div className="flex justify-between items-center relative gap-4">
          <div className="flex items-center flex-shrink-0 max-w-[calc(100%-100px)] md:max-w-[calc(100%-118px)]">
            <span
              className={clsx(
                "h-2 w-2 rounded-full mr-3 flex-shrink-0",
                type === "article"
                  ? "bg-blue"
                  : type === "video"
                  ? "bg-yellow"
                  : type === "link"
                  ? "bg-green"
                  : "bg-red"
              )}
            ></span>
            <h3 className="text-text-lvl-1 whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </h3>
          </div>
          <div className="h-[1px] w-full bg-bg-lvl-4 shrink-1 transition-colors duration-[300ms] ease-in-out"></div>
          <span className="font-mono text-sm text-text-lvl-4">
            <span className="hidden md:inline">{dateFormated}</span>
            <span className="md:hidden">{dateMobile}</span>
          </span>
        </div>
        <div className="ml-5 text-sm text-grey-400 dark:text-grey-600 md:-mt-[2px] flex gap-2 whitespace-nowrap">
          <div className="text-ellipsis overflow-hidden">
            {urlObject.protocol === "https:"
              ? urlObject.origin.slice(8)
              : urlObject.origin.slice(7)}
          </div>
          {tags.length > 0 && "/"}
          <div className="text-ellipsis overflow-hidden">
            {tags?.map((tag) => tag).join(", ")}
          </div>
        </div>
      </a>
    </li>
  );
};

export default BookmarkItem;
