import axios from 'axios'

const getSong = async ({ title, channelTitle }) => {
  const song = await axios.get(
    `https://api.genius.com/search?q=${encodeURIComponent(
      title + ' ' + channelTitle
    )}&access_token=${process.env.GENIUS_API_KEY}`
  )
  return song
}

function stringify(obj) {
  let cache = []
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
  cache = null // reset the cache
  return str
}

export async function POST(req) {
  const { title, channelTitle } = await req.json()
  const response = await getSong({ title, channelTitle })

  return Response.json({ response: stringify(response) })
}
