import clsx from "clsx";

interface PageHeaderProps {
  children: string;
  headline: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ children, headline }) => {
  return (
    <div className="flex flex-wrap">
      <h2
        className={clsx(
          "w-full text-xxl font-bold leading-10 pr-8",
          "lg:w-1/3",
          "dark:text-grey-200"
        )}
      >
        {headline}
      </h2>
      <p className="w-full mt-2 lg:w-2/3 lg:mt-[0px] dark:text-grey-300">
        {children}
      </p>
    </div>
  );
};

export default PageHeader;
