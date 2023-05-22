import { search, mapImageResources, getTags, buildImage } from "../../lib/cloudinary";
import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";

const Label = ({
  images: defaultImages,
  nextCursor: defaultNextCursor,
  totalCount: defaultTotalCount,
  activeTag: tag,
}) => {
  const [images, setImages] = useState(defaultImages);
  const [nextCursor, setNextCursor] = useState(defaultNextCursor);
  const [totalCount, setTotalCount] = useState(defaultTotalCount);
  const [activeTag] = useState(tag);
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    639: 2,
    448: 1,
  };

  return (
    <>
      <h1>{activeTag}</h1>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex mt-18 -mx-8 md:mt-24"
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
    </>
  );
};

Label.layout = "LayoutDefault";

export async function getStaticPaths() {
  const { tags } = await getTags();

  return {
    paths: tags.map((tag) => ({ params: { label: tag.toLowerCase() } })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const label = context?.params?.label;
  const results = await search({
    expression: true ? `tags="${label}"` : "",
    max_results: 100,
  });

  const {
    resources,
    next_cursor: nextCursor,
    total_count: totalCount,
  } = results;
  const images = mapImageResources(resources);

  return {
    props: {
      images: images || null,
      nextCursor: nextCursor || null,
      totalCount: totalCount || null,
      activeTag: context?.params?.label || null,
    },
  };
}

export default Label;
