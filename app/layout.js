import ThemeRegistry from './ThemeRegistry'
import './globals.css'

export const metadata = {
  title: 'YT Playlist Creator & Sharer',
  description: 'This website helps you to create a youtube playlist',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
