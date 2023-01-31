import fs from "fs";
import Head from "next/head";
import Article from "../../components/article";
import matter from "gray-matter";

export async function getStaticProps() {
  const files = fs.readdirSync("./posts");

  const posts = files.map((fileName) => {
    const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
    const { data: frontmatter } = matter(readFile);
    return frontmatter;
  });

  return {
    props: {
      posts,
    },
  };
}

export default function Blog({ posts }) {
  return (
    <div>
      <Head>
        <title>blog - iamrobin</title>
        <meta name="description" content="personal blog of iamrobin" />
      </Head>
      <section>
        <h1 className="text-3xl font-bold mb-6 p-4">Blog</h1>
          {posts.map((post) => (
            <Article key={post.slug} className="border-b-2" post={post} />
          ))}
      </section>
    </div>
  );
}
