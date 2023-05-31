import Link from "next/link";
import ArrowRightIcon from "./icons/arrow-right";

interface PeakHeadlineProps {
    headline: string;
    to?: string;
    linkname?: string;
}

const FilterItem: React.FC<PeakHeadlineProps> = ({ headline, to, linkname }) => {
    return (
        <div className="border-b border-bg-lvl-4 pb-4 mb-12 mt-20 md:mt-30 flex justify-between">
            <h2 className="text-text-lvl-2 font-bold text-md">{headline}</h2>
            {to && (
                <Link href={to} className="flex items-center text-sm text-text-lvl-3">
                    <span>{ linkname || "See all"}</span>
                    <ArrowRightIcon className="h-3 ml-1 mt-[1px]" />
                </Link>
            )}
        </div>
    );
};

export default FilterItem;
