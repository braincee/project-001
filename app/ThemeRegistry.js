'use client'
import { NextUIProvider } from '@nextui-org/react'
import { NextSeo } from 'next-seo'
import Header from '../components/Header'

export default function ThemeRegistry(props) {
  const { children } = props
  return (
    <section className='h-screen'>
      <NextUIProvider>
        <NextSeo
          title='YT Playlist Creator & Sharer'
          description='This website helps you to create a youtube playlist'
        />
        <Header />
        {children}
      </NextUIProvider>
    </section>
  )
}
