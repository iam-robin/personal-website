import { useState } from "react";
import Masonry from "react-masonry-css";
import Head from "next/head";
import {
  search,
  mapImageResources,
  getTags,
  buildImage,
} from "../../lib/cloudinary";
import PageHeader from "../../components/PageHeader";
import PhotoAlbumItem from "../../components/PhotoAlbumItem";
import clsx from "clsx";

const MAX_RESULTS = 6;

const Photos = ({
  images: defaultImages,
  nextCursor: defaultNextCursor,
  totalCount: defaultTotalCount,
  folders,
}) => {
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    639: 2,
    448: 1,
  };

  const [images, setImages] = useState(defaultImages);
  const [nextCursor, setNextCursor] = useState(defaultNextCursor);
  const [totalCount, setTotalCount] = useState(defaultTotalCount);

  console.log(folders);

  async function handleOnLoadMore(e) {
    e.preventDefault();

    const results = await fetch("/api/cloudinary/search", {
      method: "POST",
      body: JSON.stringify({
        expression: `folder=""`,
        nextCursor,
        max_results: MAX_RESULTS,
      }),
    }).then((r) => r.json());

    const {
      resources,
      next_cursor: nextPageCursor,
      total_count: updatedTotalCount,
    } = results;

    const images = mapImageResources(resources) || null;

    setImages((prev) => {
      return [...prev, ...images];
    });
    setNextCursor(nextPageCursor);
    setTotalCount(updatedTotalCount);
  }

  return (
    <div>
      <Head>
        <title>photos - iamrobin</title>
        <meta name="description" content="Photography gallery iamrobin" />
      </Head>
      <PageHeader headline="Photos">
        I have been enjoying using a camera to capture visually appealing
        moments for over a decade. My preferred equipment is a Canon eos 5d mark
        III with prime lenses (50mm and 85mm), but I also love using my Fujifilm
        x100v.
      </PageHeader>
      <h2 className="text-black font-bold mb-8 uppercase mt-24 dark:text-grey-700">
        Photo albums
      </h2>
      <div className={clsx("grid grid-cols-1 gap-8", "sm:grid-cols-2", "lg:grid-cols-3")}>
        {Object.keys(folders).map((folder) => {
          return (
            <PhotoAlbumItem
              key={folder}
              name={folder}
              photos={folders[folder]}
            />
          );
        })}
      </div>
      <h2 className="text-black font-bold mb-8 uppercase mt-24 dark:text-grey-700">
        Latest photos
      </h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -mx-8"
        columnClassName="pl-8 pr-8"
      >
        {images?.map((image) => {
          const imageUrl = buildImage(image.publicId).resize("w_800").toURL();
          return (
            <div
              className="mb-16 bg-grey-200 shadow-[inset_0_-8px_0_0_white]"
              key={image?.assetId}
            >
              <img
                src={imageUrl}
                alt={image?.publicId || "photo"}
                width="800"
              />
            </div>
          );
        })}
      </Masonry>
      {totalCount > images?.length && (
        <p>
          <button onClick={handleOnLoadMore}>Load More Results</button>
        </p>
      )}
    </div>
  );
};

export async function getStaticProps() {
  const results = await search({
    expression: "",
    max_results: MAX_RESULTS,
  });

  const {
    resources,
    next_cursor: nextCursor,
    total_count: totalCount,
  } = results;
  const images = mapImageResources(resources);
  const { tags } = await getTags();
  const folders = {};

  for (const tag of tags) {
    const results = await search({
      expression: `tags="${tag}"`,
      max_results: 3,
    });

    const { resources } = results;
    const images = mapImageResources(resources);

    images.forEach((image) => {
      let parts = image.image.split("/");
      let secondLastPart = parts[parts.length - 2];
      let newSecondLastPart = `w_200,c_scale/${secondLastPart}`;
      parts[parts.length - 2] = newSecondLastPart;
      image.image = parts.join("/");
    });

    folders[tag] = images;
  }

  return {
    props: {
      images: images || null,
      nextCursor: nextCursor || null,
      totalCount: totalCount || null,
      folders: folders || null,
    },
  };
}

Photos.layout = "LayoutDefault";

export default Photos;
