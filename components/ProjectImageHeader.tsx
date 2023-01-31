import clsx from 'clsx';

interface ProjectImageHeaderProps {
  color: string;
  image: string;
  imageWidth: string;
}

const ProjectImageHeader: React.FC<ProjectImageHeaderProps> = ({ color, image, imageWidth }) => {

  return (
    <div
      className={clsx(
        'flex items-center justify-center w-full h-[200px] rounded-xl',
        'sm: h-[360px]',
        color
      )}
    >
      <img
        src={image}
        alt="project header image"
        className={clsx(imageWidth, 'select-none')}
      />
    </div>
  );
}

export default ProjectImageHeader;
