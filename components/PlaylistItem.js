import React, { useEffect, useRef } from 'react'
import clsx from 'clsx';
import Image from 'next/image';


const PlaylistItem = (props) => {
  return (
    <a href={props.url} target="_blank" rel="noreferrer" className='group relative cursor-pointer rounded-xl bg-grey-100 dark:bg-grey-900 flex flex-col items-center py-8 px-6 group hover:bg-grey-200 dark:hover:bg-grey-850 transition-background duration-[0.5s] text-center'>
      <div
        className={clsx(
          'w-3/4 relative flex transform-three-d',
          'md:group-hover:playlist-rotate transition-all duration-500 ease-in-out'
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
      <div className='md:absolute bottom-[0] opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out  group-hover:bottom-8'>
        <p className='block font-bold leading-5 text-sm mt-3 md:mt-[0] dark:text-grey-200'>
          {props.title}
        </p>
        <p className='text-grey-500 text-sm mt-1 dark:text-grey-500'>
          {props.description}
        </p>
      </div>
    </a>
  );
}

export default PlaylistItem;
