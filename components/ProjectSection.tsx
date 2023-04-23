import clsx from 'clsx';

interface ProjecSectionProps {
  headline: string;
  description: string;
}

const ProjecSection: React.FC<ProjecSectionProps> = ({ headline, description }) => {

  return (
    <div className="flex mt-16 flex-wrap sm:mt-30">
      <h2 className={clsx(
        "w-full text-xl font-bold text-text-lvl-1",
        "sm:w-1/3",
      )}>{headline}</h2>
      <p className="w-full mt-2 sm:w-2/3 sm:mt-[0px] text-text-lvl-2">{description}</p>
    </div>
  );
}

export default ProjecSection;
