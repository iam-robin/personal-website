import Link from "next/link";
import clsx from "clsx";
import ArrowUpRightIcon from "./icons/arrow-up-right";

const ProjectCard = (props) => {
  return (
    <Link
      href={props.externalLink ? props.link : "/" + props.link}
      alt={"project card for " + props.title}
      className={clsx(
        props.color,
        "relative rounded-xl p-6 transition-all",
        "hover:scale-105 hover:rotate-2"
      )}
    >
    <div className="absolute top-3 right-3 bg-white rounded-xl px-3 py-1 text-sm bg-opacity-10 text-white ">{props.year}</div>
      <div
        className="p-12 relative flex justify-center items-center"
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
      <div>
        <span className="inline-flex items-center">
          <h2 className="inline font-bold text-white">{props.title}</h2>
          {props.externalLink && (
            <ArrowUpRightIcon className="ml-2 text-white h-2 w-2" />
          )}
        </span>
        {props.description && (
          <p className="text-white opacity-80">{props.description}</p>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
