import { ReactNode } from 'react'
import ThemeRegistry from '@/components/ThemeRegistry'
import './globals.css'

export const metadata = {
  title: 'YT Playlist Creator & Sharer',
  description: 'This website helps you to create a youtube playlist',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
