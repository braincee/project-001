import React from 'react'
import { NextUIProvider } from '@nextui-org/react'
import Header from '../components/Header'
import { NextSeo } from 'next-seo'
import '../styles/globals.css'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <NextSeo
        title='YT Playlist Creator & Sharer'
        description='This website helps you to create a youtube playlist'
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NextUIProvider>
  )
}
