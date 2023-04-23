import clsx from "clsx";
import { ReactElement } from "react";

interface PageHeaderProps {
  children: string | ReactElement;
  headline: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ children, headline }) => {
  return (
    <div className="flex flex-wrap">
      <h2
        className={clsx(
          "w-full text-xxl font-bold leading-10 pr-8 text-text-lvl-1",
          "lg:w-1/3",
        )}
      >
        {headline}
      </h2>
      <div className="w-full text-text-lvl-2 mt-2 lg:w-2/3 lg:mt-[0px]">
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
