import clsx from "clsx";
import { timeSince } from "../lib/timeSince";
import { RoughNotation } from "react-rough-notation";
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config.js'

interface VersionItemProps {
  children: string;
  version: string;
  hasLine: boolean;
  headline: string;
  date: Date;
}

const VersionItem: React.FC<VersionItemProps> = ({ children, ...props }) => {
  const { version, hasLine = true, date, headline } = props;
  const fullConfig = resolveConfig(tailwindConfig);

  return (
    <li className={clsx(
      'flex items-start space-x-10 relative',
      hasLine && 'pb-26 before:content-[""] before:bg-grey-300 before:h-[calc(100%-40px)] before:top-[40px] before:left-[33px] before:absolute before:w-[2px]',
    )}>
      <RoughNotation
        type="box"
        show={true}
        color={fullConfig.theme.colors.grey['300']}
        strokeWidth={2}
        iterations={1}
        padding={0}
        animate={false}
      >
        <div className="px-3 py-2 text-sm text-grey-400 font-medium">
          v{version}
        </div>
      </RoughNotation>
      <div>
        {headline && <h2 className="font-medium">{headline}</h2>}
        {date && <div className="text-grey-400 text-sm mb-4">{timeSince(date)}</div>}
        {children}
      </div>
    </li>
  );
}

export default VersionItem;
