import Link from "next/link";
import { MyPage } from "../components/layouts/types";
import MarkerLink from "../components/MarkerLink";
import ProjectCard from "../components/ProjectCard";
import PeakHeadline from "../components/PeakHeadline";
import BookItem from "../components/BookItem";
import clsx from "clsx";
import Head from "next/head";
import { GraphQLClient, gql } from "graphql-request";
import { search, mapImageResources, buildImage } from "../lib/cloudinary";

const Home: MyPage = ({
    lastReadBooks,
    images,
}: any) => {
    return (
        <>
            <Head>
                <title>hello - iamrobin</title>
                <meta
                    name="description"
                    content="home page of the personal website of robin spielmann iamrobin"
                />
            </Head>
            <div className="xl:grid xl:grid-cols-2 xl:gap-20 xl:mt-10">
                <h1 className="text-xl font-bold leading-normal text-text-lvl-1">
                    Hey, I am
                    <Link href="https://read.cv/iamrobin">
                        <MarkerLink
                            type="circle"
                            isExternal
                            isBold
                            delay={600}
                            text="Robin"
                        />
                    </Link>
                    –  a Design Engineer living in Munich, who enjoys working at
                    the intersection of code, design and art.
                </h1>
                <h2 className="text-md text-text-lvl-2 mt-6 xl:mt-[0]">
                    This personal website is my own little space on the internet
                    where I want to share my interests and passions with others,
                    without having to please the algorithms of social media
                    platforms or follow any other rules. I hope you enjoy
                    exploring my digital living room as much as I enjoyed
                    creating it.
                </h2>
            </div>
            <PeakHeadline
                headline="Latest projects"
                to="/projects"
                linkname="All projects"
            />
            <div
                className={clsx(
                    "grid grid-cols-1 gap-6 mt-10",
                    "md:grid-cols-2",
                    "lg:grid-cols-3 lg:gap-6",
                    "xl:grid-cols-3"
                )}
            >
                <ProjectCard
                    title="Lumon"
                    link="projects/lumon"
                    externalLink={false}
                    description="'Severance' interface"
                    color="bg-[#0E1F38]"
                    logo="/img/projects/lumon/thumb.png"
                    logoHeight="h-[33%]"
                    year="2022"
                />
                <ProjectCard
                    title="Geeenerated"
                    link="https://www.instagram.com/geeenerated/"
                    externalLink={true}
                    description="generative art"
                    color="bg-[#6F69D2]"
                    logo="/img/projects/geeenerated/thumb.svg"
                    logoHeight="h-[36%]"
                    year="ongoing"
                />
                <ProjectCard
                    title="notion budget"
                    link="projects/notionbudget"
                    description="budget data visualization"
                    color="bg-[#2D2E37]"
                    logo="/img/projects/notionbudget/thumb.png"
                    logoHeight="h-[33%]"
                    year="2021"
                />
            </div>
            <PeakHeadline
                headline="Last photos taken"
                to="/photos"
                linkname="All photos"
            />
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {images?.map((image) => {
                const imageUrl = buildImage(image.publicId)
                    .resize("w_620" as any)
                    .toURL();
                return (
                    <div
                        className="bg-grey-200"
                        key={image?.assetId}
                    >
                        <img
                            src={imageUrl}
                            alt={image?.publicId || "photo"}
                            width="620"
                            className="object-cover w-full h-full"
                        />
                    </div>
                );
            })}
            </div>
            <PeakHeadline
                headline="Last books read"
                to="/books"
                linkname="All books"
            />
            <div
                className={clsx(
                    "grid grid-cols-1 gap-6 mt-10",
                    "lg:grid-cols-3 lg:gap-6",
                )}
            >
                {lastReadBooks.booksByReadingStateAndProfile.map((book, i) => {
                    return (
                        <BookItem
                            key={i}
                            className="row-span-2"
                            image={book.cover}
                            title={book.title}
                            author={book.authors[0]?.name || ""}
                            slug={book.slug}
                            pageCount={book.pageCount}
                        />
                    );
                })}
            </div>
        </>
    );
};

export const getStaticProps = async () => {
    // CLOUDINARY (PHOTOS)
    const results = await search({
        expression: 'folder=""',
        max_results: 4,
    });

    const { resources } = results;
    const images = mapImageResources(resources);

    // LITERAL CLUB
    const endpoint = "https://literal.club/graphql/";
    const graphQLClient = new GraphQLClient(endpoint);
    graphQLClient.setHeader(
        "Authorization",
        `Bearer ${process.env.LITERAL_ACCESS_TOKEN}`
    );

    const lastReadBooksQuery = gql`
        query booksByReadingStateAndProfile(
            $limit: Int!
            $offset: Int!
            $readingStatus: ReadingStatus!
            $profileId: String!
        ) {
            booksByReadingStateAndProfile(
                limit: $limit
                offset: $offset
                readingStatus: $readingStatus
                profileId: $profileId
            ) {
                title
                cover
                pageCount
                id
                slug
                authors {
                    name
                }
            }
        }
    `;

    const lastReadBooks = await graphQLClient.request(lastReadBooksQuery, {
        limit: 3,
        offset: 0,
        readingStatus: "FINISHED",
        profileId: process.env.LITERAL_PROFILE_ID,
    });

    return {
        props: { lastReadBooks, images },
    };
};


export default Home;
Home.Layout = "Main";
