import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

interface BlogItemProps {
    post: {
        title: string;
        date: string;
        description: string;
        image?: string;
        slug: string;
        tags: string[];
    };
    isFirst?: boolean;
}

const BlogItem: React.FC<BlogItemProps> = ({ post, isFirst }) => {
    return (
        <Link href={`blog/${post?.slug}`}>
            <article className={clsx("flex gap-8 pb-8", !isFirst && "pt-8 border-t border-bg-lvl-4")}>
                <Image
                    src={post?.image}
                    alt={post?.title}
                    width={160}
                    height={120}
                    className="h-30 w-40 object-cover object-center rounded-lg"
                />
                <div>
                    <h3 className="text-base font-bold">{post?.title}</h3>
                    <p className="text-sm line-clamp-3 mt-2">{post?.description}</p>
                    <ul className="flex gap-3">
                        {post?.tags.map((tag, index) => (
                            <li key={index}>{tag}</li>
                        ))}
                    </ul>
                </div>
                <span className="ml-auto shrink-0">{post?.date}</span>
            </article>
        </Link>
    );
};

export default BlogItem;
