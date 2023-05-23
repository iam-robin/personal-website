import Link from "next/link";
import MarkerLink from "../components/MarkerLink";
import ProjectCard from "../components/ProjectCard";
import PeakHeadline from "../components/PeakHeadline";
import BookItem from "../components/BookItem";
import MusicItem from "../components/MusicItem";
import clsx from "clsx";
import Head from "next/head";
import { GraphQLClient, gql } from "graphql-request";

const Home = ({ isReadingData, topAlbumsThreeMonth, lastReadBooks }) => {
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
            {/* <h2 className="font-bold mb-10 text-md mt-40 text-text-lvl-2 border-b border-text-lvl-2 pb-4">
                Currently enjoying
            </h2>
            <div
                className={clsx(
                    "grid grid-cols-1 gap-6",
                    "lg:grid-cols-2 lg:gap-8",
                    "xl:grid-cols-3 xl:grid-rows-2 "
                )}
            >
                {isReadingData.booksByReadingStateAndProfile.map((book, i) => {
                    return (
                        <div className="row-span-2 relative" key={i}>
                            <span className="absolute top-4 left-4 text-grey-300 text-sm">
                                Reading · Book
                            </span>
                            <BookItem
                                key={i}
                                className="row-span-2"
                                image={book.cover}
                                title={book.title}
                                author={book.authors[0]?.name || ""}
                                slug={book.slug}
                                pageCount={book.pageCount}
                            />
                        </div>
                    );
                })}
                <div className="col-span-1">
                    <MusicItem
                        title={topAlbumsThreeMonth[0]?.title}
                        artist={topAlbumsThreeMonth[0]?.artist}
                        cover={topAlbumsThreeMonth[0]?.cover}
                        playCounts={topAlbumsThreeMonth[0]?.playCount}
                        url={topAlbumsThreeMonth[0]?.url}
                    />
                </div>
                <div className="row-span-2">
                    <BookItem
                        className="row-span-2"
                        image={
                            isReadingData.booksByReadingStateAndProfile[0].cover
                        }
                        title={
                            isReadingData.booksByReadingStateAndProfile[0].title
                        }
                        author={
                            isReadingData.booksByReadingStateAndProfile[0]
                                .authors[0]?.name || ""
                        }
                        slug={
                            isReadingData.booksByReadingStateAndProfile[0].slug
                        }
                        pageCount={
                            isReadingData.booksByReadingStateAndProfile[0]
                                .pageCount
                        }
                    />
                </div>
                <div className="col-span-1">
                    <MusicItem
                        title={topAlbumsThreeMonth[1]?.title}
                        artist={topAlbumsThreeMonth[1]?.artist}
                        cover={topAlbumsThreeMonth[1]?.cover}
                        playCounts={topAlbumsThreeMonth[1]?.playCount}
                        url={topAlbumsThreeMonth[1]?.url}
                    />
                </div>
                <div className="col-span-1">
                    <MusicItem
                        title={topAlbumsThreeMonth[2]?.title}
                        artist={topAlbumsThreeMonth[2]?.artist}
                        cover={topAlbumsThreeMonth[2]?.cover}
                        playCounts={topAlbumsThreeMonth[2]?.playCount}
                        url={topAlbumsThreeMonth[2]?.url}
                    />
                </div>
            </div> */}
            <PeakHeadline
                headline="Latest projects"
                to="/projects"
                linkname="All projects"
            />
            <div
                className={clsx(
                    "grid grid-cols-1 -m-8",
                    "xs:grid-cols-2",
                    "md:grid-cols-3"
                )}
            >
                <ProjectCard
                    title="Lumon"
                    // link="projects/lumon"
                    externalLink={true}
                    link="https://severance-interface.vercel.app/"
                    description="'Severance' interface"
                    color="bg-[#0E1F38]"
                    logo="/img/projects/lumon/thumb.png"
                    logoHeight="h-[33%]"
                />
                <ProjectCard
                    title="Geeenerated"
                    link="https://www.instagram.com/geeenerated/"
                    externalLink={true}
                    description="generative art"
                    color="bg-[#6F69D2]"
                    logo="/img/projects/geeenerated/thumb.svg"
                    logoHeight="h-[36%]"
                />
                <ProjectCard
                    title="notion budget"
                    link="projects/notionbudget"
                    description="budget data visualization"
                    color="bg-[#2D2E37]"
                    logo="/img/projects/notionbudget/thumb.png"
                    logoHeight="h-[33%]"
                />
            </div>
            <PeakHeadline
                headline="Last read books"
                to="/books"
                linkname="All books"
            />
            <div
                className={clsx(
                    "grid grid-cols-1 gap-6 mt-10",
                    "lg:grid-cols-2 lg:gap-10",
                    "xl:grid-cols-3"
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
    const endpoint = "https://literal.club/graphql/";
    const graphQLClient = new GraphQLClient(endpoint);
    graphQLClient.setHeader(
        "Authorization",
        `Bearer ${process.env.LITERAL_ACCESS_TOKEN}`
    );

    // const isReadingQuery = gql`
    //     query booksByReadingStateAndProfile(
    //         $limit: Int!
    //         $offset: Int!
    //         $readingStatus: ReadingStatus!
    //         $profileId: String!
    //     ) {
    //         booksByReadingStateAndProfile(
    //             limit: $limit
    //             offset: $offset
    //             readingStatus: $readingStatus
    //             profileId: $profileId
    //         ) {
    //             title
    //             cover
    //             pageCount
    //             id
    //             slug
    //             authors {
    //                 name
    //             }
    //         }
    //     }
    // `;

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

    // const isReadingData = await graphQLClient.request(isReadingQuery, {
    //     limit: 2,
    //     offset: 0,
    //     readingStatus: "IS_READING",
    //     profileId: process.env.LITERAL_PROFILE_ID,
    // });

    const lastReadBooks = await graphQLClient.request(lastReadBooksQuery, {
        limit: 3,
        offset: 0,
        readingStatus: "FINISHED",
        profileId: process.env.LITERAL_PROFILE_ID,
    });

    const count = 3;
    const resTopAlbumsThreeMonth = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${process.env.LAST_FM_USER_NAME}&api_key=${process.env.LAST_FM_API_KEY}&limit=${count}&period=1month&format=json`
    );
    const topAlbumThreeMonthQuery = await resTopAlbumsThreeMonth.json();
    const topAlbumsThreeMonth = topAlbumThreeMonthQuery?.topalbums?.album.map(
        (album) => ({
            title: album?.name,
            artist: album?.artist?.name,
            cover: album?.image[3]["#text"] || album?.image[2]["#text"],
            playCounts: album?.playcount,
            url: album?.url,
        })
    );

    return {
        props: { lastReadBooks, topAlbumsThreeMonth },
    };
};

Home.layout = "LayoutDefault";

export default Home;
