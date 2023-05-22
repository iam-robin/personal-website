import "../styles/globals.css";
import Layout from "../components/Layout";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import localFont from "@next/font/local";
import { Space_Mono } from "@next/font/google";

const spacemono = Space_Mono({
    subsets: ["latin"],
    weight: '400',
    variable: "--font-spacemono",
});

const apercu = localFont({
  src: [
    {
      path: "./apercu-regular-pro.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./apercu-bold-pro.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-apercu",
});

function MyApp({ Component, pageProps }) {
  const { asPath } = useRouter();

  useEffect(() => {
    disableAnimationOnResize();
    const routes = asPath.replace("/", "").split("/");
    routes.forEach((route) => {
      if (route) document.querySelector("body").classList.add(route);
    });
    return () => {
      routes.forEach((route) => {
        if (route) document.querySelector("body").classList.remove(route);
      });
    };
  });

  const disableAnimationOnResize = () => {
    let resizeTimer;
    window.addEventListener("resize", () => {
      document.body.classList.add("resize-animation-stopper");
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
      }, 100);
    });
  };

  return (
    <>
      <Head>
        <title>iamrobin</title>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="iamrobin portfolio robin spielmann" />
        <meta name="author" content="Robin Spielmann" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          data-goatcounter="https://iamrobin.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        ></script>
      </Head>
      <main className={`${apercu.variable} ${spacemono.variable} font-sans`}>
        <ThemeProvider defaultTheme="blue">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </main>
    </>
  );
}

export default MyApp;
