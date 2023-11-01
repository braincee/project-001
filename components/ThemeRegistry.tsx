'use client'

import { ReactNode } from 'react'
import Header from '@/components/Header'
import { NextUIProvider } from '@nextui-org/react'
import { NextSeo } from 'next-seo'

interface ThemeRegistryProps {
  children: ReactNode
}

export default function ThemeRegistry(props: ThemeRegistryProps) {
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
