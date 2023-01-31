import clsx from "clsx";
import ArrowUpRightIcon from '../public/img/icons/arrowUpRight.svg';

interface TextLinkProps {
  children: string;
  src: string;
  external?: boolean;
}

const TextLink: React.FC<TextLinkProps> = ({children, ...props }) => {
  const  { src, external = false } = props;

  return (
    <span className="inline-flex items-center mr-1">
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className={clsx(
        'inline-flex items-center cursor-pointer relative',
        'underline decoration-dotted decoration-blue underline-offset-[6px] decoration-2',
        'hover:text-blue',
      )}
    >
      {children}
    </a>
    { external && <ArrowUpRightIcon className=" h-2 w-2 ml-[6px] fill-black dark:fill-grey-200" /> }
    </span>
  );
}

export default TextLink;
