import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";

const PlaylistItem = (props) => {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noreferrer"
      className="group relative cursor-pointer rounded-xl bg-grey-100 dark:bg-grey-900 flex items-center py-6 px-6 pr-12 group hover:bg-grey-200 dark:hover:bg-grey-850 transition-background duration-[0.5s] gap-8"
    >
      <div
        className={clsx(
          "absolute right-6 top-6 w-3 h-3 flex items-center justify-center text-xl text-grey-300 dark:text-grey-600",
          "group-hover:text-grey-500 dark:group-hover:text-grey-300 transition-all duration-[0.5s] group-hover:translate-x-1 group-hover:-translate-y-1"
        )}
      >
        ↗
      </div>
      <Image
        src={props.cover}
        alt={props.title}
        width={80}
        height={80}
        className="rounded-sm shrink-0 h-20 w-20"
      />
      <div>
        <p className="block font-bold leading-5 md:mt-[0] dark:text-grey-200">
          {props.title}
        </p>
        <p className="text-grey-500 leading-5 mt-2 dark:text-grey-500">
          {props.description}
        </p>
      </div>
    </a>
  );
};

export default PlaylistItem;
