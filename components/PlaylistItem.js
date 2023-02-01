import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";

const PlaylistItem = (props) => {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noreferrer"
      className="group relative cursor-pointer rounded-xl bg-grey-100 dark:bg-grey-900 flex items-center py-6 px-6 group hover:bg-grey-200 dark:hover:bg-grey-850 transition-background duration-[0.5s] gap-8 mb-6"
    >
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
