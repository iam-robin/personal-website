import { useState } from "react";
import clsx from "clsx";
import TextLink from "../components/TextLink";
import FilterItem from "../components/FilterItem";
import PageHeader from "../components/PageHeader";
import BookItem from "../components/BookItem";
import Head from "next/head";
import { GraphQLClient, gql } from "graphql-request";

export const getServerSideProps = async () => {
  const endpoint = "https://literal.club/graphql/";
  const graphQLClient = new GraphQLClient(endpoint);
  graphQLClient.setHeader(
    "Authorization",
    `Bearer ${process.env.LITERAL_ACCESS_TOKEN}`
  );

  const shelfQuery = gql`
    query getShelvesByProfileId(
      $profileId: String!
      $limit: Int!
      $offset: Int!
    ) {
      getShelvesByProfileId(
        profileId: $profileId
        limit: $limit
        offset: $offset
      ) {
        title
        books {
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
    }
  `;

  const wantToReadQuery = gql`
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

  const shelfData = await graphQLClient.request(shelfQuery, {
    limit: 100,
    offset: 0,
    profileId: process.env.LITERAL_PROFILE_ID,
  });

  const wantToReadData = await graphQLClient.request(wantToReadQuery, {
    limit: 100,
    offset: 0,
    readingStatus: "WANTS_TO_READ",
    profileId: process.env.LITERAL_PROFILE_ID,
  });

  return {
    props: { shelfData, wantToReadData },
  };
};

const Books = ({ shelfData, wantToReadData }) => {
  const [activeTab, setActiveTab] = useState(
    shelfData.getShelvesByProfileId[0].title
  );

  return (
    <div>
      <Head>
        <title>books - iamrobin</title>
        <meta name="description" content="book overview iamrobin" />
      </Head>
      <PageHeader headline="Reading List">
        I would like to read more books. Keeping a list of all the books
        I&apos;ve read and enjoyed will hopefully help me do that. Each book
        links to its corresponding page on the awesome book platform{" "}
        <TextLink src="https://literal.club/iamrobin" external>
          Literal
        </TextLink>
        .
      </PageHeader>
      <ul className="mt-20 gap-x-6 gap-y-3 flex cursor-pointer flex-wrap">
        {shelfData.getShelvesByProfileId.map((shelf, i) => {
          return (
            shelf.title !== "graphic novels / mangas" && (
              <li
                key={i}
                onClick={() => {
                  setActiveTab(shelf.title);
                }}
              >
                <FilterItem
                  name={shelf.title}
                  count={shelf.books.length}
                  active={shelf.title === activeTab}
                />
              </li>
            )
          );
        })}
        <li
          onClick={() => {
            setActiveTab("wantToRead");
          }}
        >
          <FilterItem
            name="Want to read"
            count={wantToReadData.booksByReadingStateAndProfile.length}
            active={"wantToRead" === activeTab}
          />
        </li>
      </ul>
      <div
        className={clsx(
          "grid grid-cols-1 gap-6 mt-10",
          "lg:grid-cols-2 lg:gap-10",
          "xl:grid-cols-3"
        )}
      >
        {activeTab === "wantToRead"
          ? wantToReadData.booksByReadingStateAndProfile.map((book, i) => {
              return (
                <BookItem
                  key={i}
                  image={book.cover}
                  title={book.title}
                  author={book.authors[0]?.name || ""}
                  slug={book.slug}
                  pageCount={book.pageCount}
                />
              );
            })
          : shelfData.getShelvesByProfileId
              .find((obj) => obj.title === activeTab)
              .books.map((book, i) => {
                return (
                  <BookItem
                    key={i}
                    image={book.cover}
                    title={book.title}
                    author={book.authors[0]?.name || ""}
                    slug={book.slug}
                    pageCount={book.pageCount}
                  />
                );
              })}
      </div>
    </div>
  );
};

Books.layout = "LayoutDefault";

export default Books;
