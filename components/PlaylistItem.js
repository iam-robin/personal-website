import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";
import ArrowUpRightIcon from "./icons/arrow-up-right";

const PlaylistItem = (props) => {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noreferrer"
      className="group relative cursor-pointer rounded-xl bg-bg-lvl-2 flex items-center py-6 px-6 pr-12 group hover:bg-bg-lvl-4 transition-background duration-[0.5s] gap-8"
    >
      <div
        className={clsx(
          "absolute right-6 top-6 w-3 h-3 flex items-center justify-center text-xl text-text-lvl-5",
          "group-hover:text-text-lvl-4 transition-all duration-[0.5s] group-hover:translate-x-1 group-hover:-translate-y-1"
        )}
      >
        <ArrowUpRightIcon />
      </div>
      <Image
        src={props.cover}
        alt={props.title}
        width={80}
        height={80}
        className="rounded-sm shrink-0 h-20 w-20"
      />
      <div>
        <p className="block font-bold leading-5 md:mt-[0] text-text-lvl-1">
          {props.title}
        </p>
        <p className="leading-5 mt-2 text-text-lvl-3">
          {props.description}
        </p>
      </div>
    </a>
  );
};

export default PlaylistItem;
