import axios from 'axios'

const ApiKey = process.env.GOOGLE_API_KEY

const fetchSearchVideos = async (query) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&key=${ApiKey}`
    )
    return response
  } catch (err) {
    console.error(err)
  }
}

export async function POST(req) {
  const { query } = req.json()
  const { data, err } = await fetchSearchVideos(query)

  return Response.json({ response: data, err: err })
}
