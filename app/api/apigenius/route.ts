import axios from 'axios'

const getSong = async ({
  title,
  channelTitle,
}: {
  title: string
  channelTitle: string
}) => {
  const song = await axios.get(
    `https://api.genius.com/search?q=${encodeURIComponent(
      title + ' ' + channelTitle
    )}&access_token=${process.env.GENIUS_API_KEY}`
  )
  return song
}

function stringify(obj: any) {
  let cache: any[] = []
  let str = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return
      }
      // Store value in our collection
      cache.push(value)
    }
    return value
  })
  cache = [] // reset the cache
  return str
}

export async function POST(req: Request) {
  const { title, channelTitle } = await req.json()
  const response = await getSong({ title, channelTitle })

  return Response.json({ response: stringify(response) })
}
