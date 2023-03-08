import React, { useEffect, useRef } from 'react'
import clsx from 'clsx';
import Image from 'next/image';


const MusicItem = (props) => {
  return (
    <a href={props.url} key={props.index} target="_blank" rel="noreferrer" className='group cursor-pointer rounded-xl bg-grey-100 dark:bg-grey-900 flex flex-col items-center p-6 pt-10 group hover:bg-grey-200 dark:hover:bg-grey-850 transition-background duration-[0.5s] text-center'>
      <div
        className={clsx(
          'w-3/4 relative flex transform-three-d border-[1px] border-grey-250 dark:border-grey-850',
          'after:vinyl after:content-[""] left-[0] after:-z-10 after:bg-grey-600 after:rounded-full after:h-[94%] after:w-[94%] after:absolute after:left-[3%] after:top-[3%]',
          'before:content-[""] before:rounded-sm before:-z-10 before:bg-grey-400 dark:before:bg-grey-750 before:h-full before:w-full before:absolute before:right-[0px] before:top-[0] before:transition-all before:duration-[400ms] before:ease-in-out before:delay-[100ms]',
          'md:group-hover:album-rotate md:group-hover:-left-6 md:group-hover:after:left-16 transition-all duration-500 ease-in-out after:transition-all after:duration-[400ms] after:ease-in-out after:delay-[100ms] group-hover:before:-right-[4px]',
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
      <p className='font-bold text-sm leading-5 mt-5 dark:text-grey-200'>
        {props.title}
      </p>
      <p className='text-grey-500 text-sm'>
        {props.artist}
      </p>
    </a>
  );
}

export default MusicItem;
