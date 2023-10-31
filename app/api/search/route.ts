import axios from 'axios'

const ApiKey = process.env.GOOGLE_API_KEY

const fetchSearchVideos = async (query: string) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&key=${ApiKey}`
    )
    return response
  } catch (err) {
    console.error(err)
  }
}

export async function POST(req: Request) {
  const { query } = await req.json()
  const response = await fetchSearchVideos(query)

  return Response.json(response)
}
