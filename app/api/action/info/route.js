import axios from 'axios'

const ApiKey = process.env.GOOGLE_API_KEY

const getInfo = async ({ videoId }) => {
  const info = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${ApiKey}&id=${videoId}`
  )
  return info
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

export async function GET(req) {
  const { videoId } = req.json()
  const response = await getInfo({ videoId })
  return Response.json({ response: stringify(response) })
}
