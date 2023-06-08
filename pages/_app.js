import React from "react";
import { NextUIProvider } from '@nextui-org/react';
import Header from '../components/Header';


import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <Header />
      <Component {...pageProps} />
    </NextUIProvider>
  )
}
