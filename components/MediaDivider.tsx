import clsx from "clsx";

interface MediaDividerProps {
  children: string;
}

const MediaDivider: React.FC<MediaDividerProps> = ({ children }) => {

  return (
    <h2 className={clsx(
      'mt-24 mb-12 text-grey-300 dark:text-grey-750 font-bold text-center relative uppercase',
      'after:content-[""] after:bg-grey-100 dark:after:bg-grey-900 after:h-[2px] after:w-full after:absolute after:left-[0px] after:top-[12px]',
    )}>
      <span className='bg-white dark:bg-grey-950 px-5 z-10 relative'>
        {children}
      </span>
    </h2>
  );
}

export default MediaDivider;
