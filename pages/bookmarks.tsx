import { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import clsx from "clsx";
import PageHeader from "../components/PageHeader";
import FilterItem from "../components/FilterItem";
import BookmarkItem from "../components/BookmarkItem";
import TextLink from "../components/TextLink";
import { fetchBookmarks } from "../lib/raindrop";
import { Bookmark } from "../types/bookmark";

type Tag = {
  title: string;
  frequency: number;
};

type Props = {
  bookmarks: Bookmark[];
  tags: Tag[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const bookmarks = await fetchBookmarks();

  const tagFrequency = []
    .concat(...bookmarks?.map(({ tags }) => tags))
    .reduce((freq, tag) => {
      freq[tag] = (freq[tag] || 0) + 1;
      return freq;
    }, {});

  const tags = Object.entries(tagFrequency)
    ?.map(([title, frequency]): { title: string; frequency: number } => ({
      title,
      frequency: frequency as number,
    }))
    .sort((a, b) => b.frequency - a.frequency);

  const props: Props = { bookmarks, tags };

  return {
    props,
    revalidate: 60 * 60,
  };
};

const Bookmarks = ({ bookmarks, tags }: Props) => {
  const [displayBookmarks, setDisplayBookmarks] = useState(bookmarks);
  const [activeTag, setActiveTag] = useState<string>("all");
  const filterBookmarks = (tag?: string) => {
    if (tag) {
      setDisplayBookmarks(bookmarks.filter(({ tags }) => tags.includes(tag)));
    } else {
      setDisplayBookmarks(bookmarks);
    }
    setActiveTag(tag);
  };

  return (
    <div className="relative">
      <PageHeader headline="Bookmarks">
        <>
          Daily I receive new articles, videos, essays, etc. in the RSS reader
          of my choice{" "}
          <TextLink src="https://reederapp.com/" external>
            Reeder
          </TextLink>
          . Some I read immediately, while others I save for later using my
          trusted read-it-later tool,{" "}
          <TextLink src="https://getpocket.com/" external>
            Pocket
          </TextLink>
          . I categorize and tag items I have read and found interesting in{" "}
          <TextLink src="https://raindrop.io/" external>
            Raindrop.io
          </TextLink>
          . Thanks to their fantastic API, I can also share that list here on my
          personal website.
          <ul className="flex gap-4 mt-5 text-xs text-grey font-mono">
            <li className="flex items-center gap-2">
              <div className={clsx(
                "h-[6px] w-[6px] rounded-full bg-blue",
                )}></div>
              article
            </li>
            <li className="flex items-center gap-1">
              <div className={clsx(
                "h-[6px] w-[6px] rounded-full bg-green",
                )}></div>
              website
            </li>
            <li className="flex items-center gap-1">
              <div className={clsx(
                "h-[6px] w-[6px] rounded-full bg-yellow",
                )}></div>
              video
            </li>
            <li className="flex items-center gap-1">
              <div className={clsx(
                "h-[6px] w-[6px] rounded-full bg-red",
                )}></div>
              misc
            </li>
          </ul>
        </>
      </PageHeader>
      <ul className="mt-20 gap-x-4 gap-y-2 flex cursor-pointer flex-wrap">
        <li
          onClick={() => {
            filterBookmarks();
            setActiveTag("all");
          }}
        >
          <FilterItem
            name="All"
            count={bookmarks?.length}
            active={activeTag === "all"}
          />
        </li>
        {tags?.map((tag, i) => {
          return (
            <li
              key={i}
              onClick={() => {
                setActiveTag(tag.title);
                filterBookmarks(tag.title);
              }}
            >
              <FilterItem
                name={tag.title}
                count={tag.frequency}
                active={tag.title === activeTag}
              />
            </li>
          );
        })}
      </ul>
      <ul
        className={clsx(
          "mt-8 group xl:max-w-none",
        )}
      >
        {displayBookmarks?.map(({ title, created, tags, link, type }) => (
          <BookmarkItem
            key={title}
            title={title}
            date={created}
            tags={tags}
            url={link}
            type={type}
          />
        ))}
      </ul>
    </div>
  );
};

Bookmarks.layout = "LayoutDefault";

export default Bookmarks;
