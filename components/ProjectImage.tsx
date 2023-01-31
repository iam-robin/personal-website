import Image from 'next/image';

interface ProjecImageProps {
  src: string;
  alt: string;
  height: number;
  width: number;
}

const ProjectImage: React.FC<ProjecImageProps> = ({ src, alt = "project image", height, width = 1600 }) => {

  return (
    <div className='mt-10'>
      <Image
        src={src}
        height={height}
        width={width}
        alt={alt}
        className='rounded-xl'
      />
    </div>
  );
}

export default ProjectImage;
