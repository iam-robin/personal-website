import Link from "next/link";
import clsx from "clsx";
import ArrowUpRightIcon from "./icons/arrow-up-right";

const ProjectCard = (props) => {
  return (
    <Link
      href={props.externalLink ? props.link : "/" + props.link}
      alt={"project card for " + props.title}
      className={clsx(
        "relative py-5 px-8 sm:p-6 md:p-8",
        "after:content-[''] after:absolute after:top-3 after:left-3 after:w-[calc(100%-24px)] after:h-[calc(100%-24px)] sm:after:bg-bg-lvl-2 after:rounded-xl",
        "after:opacity-0 after:scale-95 after:transition-scale after:duration-300 after:ease-in-out",
        "hover:after:opacity-100 hover:after:scale-100",
      )}
    >
      <div
        className={`${props.color} aspect-[3/2] z-10 relative flex justify-center items-center rounded-xl transition-transform`}
      >
        {props.logo && (
          <img
            src={props.logo}
            alt={`${props.title} logo`}
            className={clsx(
              "max-h-16",
              `${props.logoHeight ? props.logoHeight : "h-[35%]"}`
            )}
          />
        )}
      </div>
      <div className={clsx("pt-3 px-1 z-10 relative")}>
        <span className="inline-flex items-center">
          <h2 className="inline font-bold text-text-lvl-1">{props.title}</h2>
          {props.externalLink && (
            <ArrowUpRightIcon className="ml-2 text-text-lvl-2 h-2 w-2" />
          )}
        </span>
        {props.description && (
          <p className="text-text-lvl-3">{props.description}</p>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
