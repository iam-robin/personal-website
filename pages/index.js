import { useEffect } from "react";
import Link from "next/link";
import MarkerLink from "../components/MarkerLink";
import clsx from "clsx";
import Head from "next/head";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.js";

const Home = () => {
  return (
    <>
      <Head>
        <title>hello - iamrobin</title>
        <meta
          name="description"
          content="home page of the personal website of robin spielmann iamrobin"
        />
      </Head>
      <h1 className="text-xxl font-bold leading-normal dark:text-grey-200">
        Hey, I am
        <Link href="https://read.cv/iamrobin">
          <MarkerLink type="circle" delay={600} text="Robin↗" />
        </Link>
        –  a design Engineer living in Munich, who enjoys working at the
        intersection of code, design and art.
      </h1>
      <h2 className="text-lg mt-6 dark:text-grey-200">
        Besides&nbsp;
        <Link href="/projects">
          <MarkerLink type="underline" delay={1200} text="building stuff" />
        </Link>
        &nbsp;for the internet, there are several other things that make a day
        in my life a good day. I enjoy being outside with with my camera, trying
        to wrap the chaos of the environment into minimalist&nbsp;
        <Link href="/photos">
          <MarkerLink type="underline" delay={1800} text="photos" />
        </Link>
        &nbsp;or simply to have a relaxed walk, being attentive to my
        surroundings. Furthermore I like to experiment with&nbsp;
        <Link
          href="https://www.instagram.com/geeenerated/"
          className="inline-block"
        >
          <MarkerLink type="underline" delay={2400} text="generative art↗" />
        </Link>
        &nbsp;– there&apos;s nothing quite like making a computer create
        something that looks like it was made by a toddler with a box of
        crayons. And then, if there&apos;s still time and energy left, I&apos;ll
        probably be on the couch with a book because I&apos;m trying to spend
        more time&nbsp;
        <Link href="/books">
          <MarkerLink type="underline" delay={3000} text="reading" />
        </Link>
        . Otherwise, I like to discover new&nbsp;
        <Link href="/music">
          <MarkerLink type="underline" delay={3600} text="music" />
        </Link>
        &nbsp;and watch some good&nbsp;
        <Link href="https://letterboxd.com/iamrobin/">
          <MarkerLink type="underline" delay={4200} text="movies↗" />
        </Link>
        &nbsp;or&nbsp;
        <Link href="https://mustapp.com/@iamrobin/shows">
          <MarkerLink type="underline" delay={4800} text="TV series↗" />
        </Link>
        .
        <br/>
        <br/>
        This personal website is my own little space on the internet where I
        want to share my interests and passions with others, without having to
        please the algorithms of social media platforms or follow any other
        rules. I hope you enjoy exploring my digital living room as much as I
        enjoyed creating it.
      </h2>
    </>
  );
};

Home.layout = "LayoutDefault";

export default Home;
