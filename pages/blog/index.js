import { useState } from "react";
import fs from "fs";
import Head from "next/head";
import BlogItem from "../../components/BlogItem";
import matter from "gray-matter";
import PageHeader from "../../components/PageHeader";
import FilterItem from "../../components/FilterItem";

export async function getStaticProps() {
  const files = fs.readdirSync("./posts");

  const posts = files.map((fileName) => {
    const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
    const { data: frontmatter } = matter(readFile);
    return frontmatter;
  });

  const tagFrequency = []
    .concat(...posts.map(({ tags }) => tags))
    .reduce((freq, tag) => {
      freq[tag] = (freq[tag] || 0) + 1;
      return freq;
    }, {});

  const tags = Object.entries(tagFrequency)
    .map(([name, frequency]) => ({
      name,
      frequency,
    }))
    .sort((a, b) => b.frequency - a.frequency);

  return {
    props: {
      posts,
      tags,
    },
  };
}

export default function Blog({ posts, tags }) {
  const [activeTag, setActiveTag] = useState("all");
  return (
    <div>
      <Head>
        <title>blog - iamrobin</title>
        <meta name="description" content="personal blog of iamrobin" />
      </Head>
      <section>
        <PageHeader headline="Blog">
          Culpa do dolore deserunt est velit officia Lorem culpa. Laboris culpa
          eu magna officia tempor aute ipsum minim amet laborum. Nulla laborum
          magna velit. Qui et esse eiusmod ullamco fugiat sunt deserunt do
          aliqua laboris nostrud minim aute nostrud. Labore qui dolore minim
          dolor esse sunt qui quis veniam ex esse consequat. Tempor Lorem
          proident consequat dolor.
        </PageHeader>
        <ul className="mt-20 gap-x-6 gap-y-3 flex cursor-pointer flex-wrap">
          <li
            onClick={() => {
              setActiveTag("all");
            }}
          >
            <FilterItem
              name="All"
              count={posts.length}
              active={"all" === activeTag}
            />
          </li>
          {tags.map((tag, i) => {
            return (
              <li
                key={i}
                onClick={() => {
                  setActiveTag(tag.name);
                }}
              >
                <FilterItem
                  name={tag.name}
                  count={tag.frequency}
                  active={tag.name === activeTag}
                />
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col mt-16">
            {activeTag === "all"
            ? posts.map((post, index) => (
                <BlogItem key={post.slug} isFirst={index == 0} className="border-b-2" post={post} />
                ))
            : posts.filter(({ tags }) => tags.includes(activeTag)).map((post, index) => (
                <BlogItem key={post.slug} className="border-b-2" isFirst={index == 0} post={post} />
            ))
            }
        </div>
      </section>
    </div>
  );
}
