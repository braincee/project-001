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
        <section className='flex flex-col gap-5'>
          <Header />
          {children}
        </section>
      </NextUIProvider>
    </section>
  )
}
