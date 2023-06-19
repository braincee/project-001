import React from "react";
import { NextUIProvider } from '@nextui-org/react';
import Header from '../components/Header';
import { NextSeo } from "next-seo";

import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <NextSeo
        title="YT Playlist Creator & Sharer"
        description="This website helps you to create a youtube playlist"
      />
      <Header />
      <Component {...pageProps} />
    </NextUIProvider>
  )
}
