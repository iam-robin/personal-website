import React, { useEffect, useRef } from "react";
import Link from "next/link";

interface PhotoAlbumItemProps {
  name: string;
  photos: any;
}

const PhotoAlbumItem: React.FC<PhotoAlbumItemProps> = ({ name, photos }) => {
  return (
    <Link
      href={"/photos/" + name}
      className="block bg-grey-100 hover:bg-grey-150 dark:bg-grey-900 hover:dark:bg-grey-850"
    >
      <div className="grid w-30 h-30">
        {photos.map((image) => {
          return <img key="i" src={image.image} className="w-full h-full object-cover border-4 border-white" />;
        })}
      </div>
      <p>{name}</p>
    </Link>
  );
};

export default PhotoAlbumItem;
