import React from "react";
import clsx from "clsx";
import Image from "next/image";

const MusicItem = (props) => {
    return (
        <a
            href={props.url}
            target="_blank"
            rel="noreferrer"
            className="group h-full relative cursor-pointer rounded-xl bg-bg-lvl-2 flex items-center py-6 px-6 pr-6 group hover:bg-bg-lvl-4 transition-background duration-[0.5s] gap-6"
        >
            <div
                className={clsx(
                    "w-20 h-20 relative shrink-0 flex transform-three-d border-[1px] border-bg-lvl-4",
                    'after:vinyl after:content-[""] left-[0] after:-z-10 after:bg-grey-600 after:rounded-full after:h-[94%] after:w-[94%] after:absolute after:left-[3%] after:top-[3%]',
                    'before:content-[""] before:rounded-sm before:-z-10 before:bg-text-lvl-4 before:h-full before:w-full before:absolute before:right-[0px] before:top-[0] before:transition-all before:duration-[400ms] before:ease-in-out before:delay-[100ms]',
                    "md:group-hover:album-rotate md:group-hover:-left-6 md:group-hover:after:left-12 transition-all duration-500 ease-in-out after:transition-all after:duration-[400ms] after:ease-in-out after:delay-[100ms] group-hover:before:-right-[4px]"
                )}
            >
                <Image
                    src={props.cover}
                    alt={props.title}
                    width={560}
                    height={560}
                    className="rounded-sm"
                />
            </div>
            <div>
                <p className="block font-bold leading-5 md:mt-[0] text-text-lvl-1 line-clamp-2">
                    {props.title}
                </p>
                <p className="text-text-lvl-3 leading-5 mt-1">
                    {props.artist}
                </p>
            </div>
        </a>
    );
};

export default MusicItem;
