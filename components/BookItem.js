import React, { useEffect, useRef } from 'react'
import clsx from 'clsx';
import ArrowUpRightIcon from "../components/icons/arrow-up-right";

function mapRange(value, low1, high1, low2, high2) {
  return Math.round(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
}

const BookItem = (props) => {
  const bookRef = useRef();

  useEffect(() => {
    const height = props.pageCount ? mapRange(props.pageCount, 1, 1000, 8, 64) + 'px' : '16px';
    bookRef.current.style.setProperty('--book-height', height);
  }, [props.pageCount])

  return (
    <a href={`https://literal.club/book/${props.slug}`} target="_blank" rel="noreferrer" className='block h-full cursor-pointer rounded-xl bg-bg-lvl-2 border border-bg-lvl-4 p-8 lg:p-14 hover:bg-bg-lvl-4 group transition-background duration-[0.5s]'>
      <div className={clsx(
        'flex h-full gap-8',
        'lg:justify-center lg:items-center lg:gap-[0]',
        'book-perspective',
      )}>
        {/* book info */}
        <div className={clsx(
          'text-left',
          'lg:absolute lg:top-[-24px] lg:left-[-24px] lg:right-[-24px] lg:opacity-0 lg:-translate-y-4',
          'transition-all duration-500 ease-in-out',
          'lg:group-hover:opacity-100 lg:group-hover:translate-y-[0]',
        )}>
          <h3 className='text-base font-bold leading-[1.2] text-text-lvl-1'>{props.title}</h3>
          <p className='text-base mt-1 text-text-lvl-3 lg:text-base'>{props.author}</p>
        </div>
        {/* book image */}
        <div
          ref={bookRef}
          className={clsx(
            'relative transition-transform duration-[0.5s] ease-in-out transform-three-d order-[-1] w-12 shrink-0',
            'lg:group-hover:book-rotate lg:w-1/2 lg:order-1',
            'xl:w-full xl:max-w-[120px]',
            `after:hidden lg:after:block after:content-[""] after:book-stripes after:bg-grey-100 after:w-[calc(100%+0.5px)] after:absolute after:left-0 after:rounded-l-md after:border-y-[3px] after:border-l-[4px] after:border-grey-800 dark:after:border-grey-700`,
            'after:book-bottom',
            `before:hidden lg:before:block before:content-[""] before:book-stripes-right before:bg-white before:h-[calc(100%+0.5px)] before:absolute before:-right-[0] before-top-0 before:border-x-[3px] before:border-x-grey-800 dark:before:border-x-grey-700 before:border-t-[3px] before:border-t-grey-200 dark:before:border-t-grey-900`,
            'before:book-right',
          )}
        >
          <img
            src={props.image}
            alt={props.title}
            className={clsx(
              'rounded-[3px] lg:group-hover:rounded-l-lg lg:group-hover:rounded-r-none transition-radius duration-300 ease-in-out',
            )} />
        </div>
        {/* book literal link */}
        <div className={clsx(
          'hidden absolute font-bold text-blue text-sm bottom-[-24px] left-[-24px] right-[-24px] opacity-0 translate-y-4',
          'transition-[opacity,transform] duration-500 ease-in-out',
          'group-hover:opacity-100 group-hover:translate-y-[0]',
          'lg:block',
        )}>
          <span
            className={clsx(
              "inline-flex items-center mr-1",
              'inline-flex items-center cursor-pointer relative',
              'underline decoration-dotted decoration-blue underline-offset-[6px] decoration-2',
              'hover:text-blue',
            )}
          >
            View on Literal
            <ArrowUpRightIcon className=" h-2 w-2 ml-[6px] fill-blue" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default BookItem;
