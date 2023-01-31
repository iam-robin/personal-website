import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import Head from "next/head";
import {
  search,
  mapImageResources,
  // getFolders,
  buildImage,
} from "../lib/cloudinary";
// import clsx from "clsx";
import PageHeader from "../components/PageHeader";
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config.js'

const MAX_RESULTS = 100;

const Photos = ({
  images: defaultImages,
  nextCursor: defaultNextCursor,
  totalCount: defaultTotalCount,
  // folders,
}) => {
  const fullConfig = resolveConfig(tailwindConfig);
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    639: 2,
    448: 1,
  };

  const [images, setImages] = useState(defaultImages);
  const [nextCursor, setNextCursor] = useState(defaultNextCursor);
  const [totalCount, setTotalCount] = useState(defaultTotalCount);
  // const [activeFolder, setActiveFolder] = useState();

//   useEffect(() => {
//     document.body.style.setProperty("--background-color", fullConfig.theme.colors.grey['200']);
//   }, [fullConfig.theme]);

  //   console.log("images render", images);
  // console.log('nextCursor', nextCursor);
  // console.log('totalCount', totalCount);

  // useEffect(() => {
  //   (async function run() {
  //     const results = await fetch("/api/cloudinary/search", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         expression: `folder="${activeFolder || ""}"`,
  //       }),
  //     }).then((r) => r.json());

  //     const {
  //       resources,
  //       next_cursor: nextPageCursor,
  //       total_count: updatedTotalCount,
  //     } = results;

  //     const images = mapImageResources(resources);

  //     setImages(images);
  //     setNextCursor(nextPageCursor);
  //     setTotalCount(updatedTotalCount);
  //   })();
  // }, [activeFolder]);

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

  // function handleOnFolderClick(e) {
  //   const folderPath = e.target.dataset.folderPath;
  //   if (folderPath === activeFolder) return;
  //   setActiveFolder(folderPath);
  //   setNextCursor(undefined);
  //   setImages([]);
  //   setTotalCount(0);
  // }

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
      {/* <h2>Folders</h2>
      <ul onClick={handleOnFolderClick}>
        {folders.map((folder) => {
          const isActive = folder.path === activeFolder;
          return (
            <li
              key={folder.path}
            >
              <button
                data-folder-path={folder.path}
                className={clsx(isActive ? "bg-blue" : "bg-grey-100")}
              >{folder.name}</button>
            </li>
          );
        })}
      </ul> */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex mt-18 -mx-8 md:mt-40"
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
              {/* <CldImage
                width="800"
                height="800"
                src={image?.publicId}
                alt="photo"
                loading="lazy"
              /> */}
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
    expression: 'folder=""',
    max_results: MAX_RESULTS,
  });

  const {
    resources,
    next_cursor: nextCursor,
    total_count: totalCount,
  } = results;
  const images = mapImageResources(resources);
  // const { folders } = await getFolders();

  return {
    props: {
      images: images || null,
      nextCursor: nextCursor || null,
      totalCount: totalCount || null,
      // folders: folders || null,
    },
  };
}

Photos.layout = "LayoutDefault";

export default Photos;
