import clsx from 'clsx';

interface ProjectInfoProps {
  children: string;
  headline: string;
  description: string;
  year: string;
  roles: string[];
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({children, ...props }) => {
  const {headline, year, roles} = props;

  return (
    <div className="flex flex-wrap mt-16">
      <h1 className={clsx(
        "w-full text-xxl font-bold mt-[-8px] text-text-lvl-1",
        "sm:w-1/3",
      )}>{headline}</h1>
      <div className={clsx(
        "w-full mt-4 text-text-lvl-2",
        "sm:w-2/3 sm:mt-[0px]",
      )}>
        <p>{children}</p>
        <div className="flex items-center space-x-10 mt-10">
          <div className={clsx(
            'text-grey-300 uppercase text-sm font-bold dark:text-grey-700',
          )}>year</div>
          <div className="text-sm">{year}</div>
        </div>
        {
          roles &&
          <div className="flex items-center space-x-10 mt-4">
            <div className={clsx(
              'text-grey-300 uppercase text-sm font-bold dark:text-grey-700',
            )}>role</div>
            <ul className="flex flex-wrap">
              {
                roles.map((role, i) => (
                  <li key={i} className="text-sm">
                    {role}
                    {i != roles.length - 1 && <span className='mx-2'>|</span>}
                  </li>
                ))
              }
            </ul>
          </div>
        }
      </div>
    </div>
  );
}

export default ProjectInfo;
