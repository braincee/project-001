import { NextUIProvider } from '@nextui-org/react'
import { children } from 'cheerio/lib/api/traversing'
import { NextSeo } from 'next-seo'

export default function ThemeRegistry(props) {
  const { children } = props
  return (
    <NextUIProvider>
      <NextSeo
        title='YT Playlist Creator & Sharer'
        description='This website helps you to create a youtube playlist'
      />
      {children}
    </NextUIProvider>
  )
}
