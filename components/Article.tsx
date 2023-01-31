import Link from "next/link";

interface ArticleProps {
  post: {
    title: string;
    date: string;
    description: string;
    image?: string;
    slug: string;
    tags: string[];
  }
}

const Article: React.FC<ArticleProps> = ({ post }) => {
  return (
    <article>
    <Link href={`blog/${post.slug}`}><h3>{post.title}</h3></Link>
    <p>{post.date} | {post.tags.map(tag => tag).join(', ')}</p>
    <p>
        {post.description}
    </p>
</article>
  );
};

export default Article;
