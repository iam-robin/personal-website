import Link from "next/link";

interface BlogItemProps {
  post: {
    title: string;
    date: string;
    description: string;
    image?: string;
    slug: string;
    tags: string[];
  };
}

const BlogItem: React.FC<BlogItemProps> = ({ post }) => {
  return (
    <article>
      <Link href={`blog/${post?.slug}`}>
        <h3>{post?.title}</h3>
      </Link>
      <p>
        {post?.date} | {post?.tags.map((tag) => tag).join(", ")}
      </p>
    </article>
  );
};

export default BlogItem;
