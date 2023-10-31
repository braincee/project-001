//@ts-ignore
import { getSubtitles } from 'youtube-captions-scraper'

const fetchSubtitles = async ({
  videoId,
  defaultLanguage,
}: {
  videoId: string
  defaultLanguage: string
}) => {
  try {
    const response = await getSubtitles({
      videoID: videoId,
      lang: defaultLanguage || 'en',
    })
    return response
  } catch (err) {
    console.error(err)
  }
}

export async function POST(req: Request) {
  const { videoId, defaultLanguage } = await req.json()
  const response = await fetchSubtitles({
    videoId,
    defaultLanguage,
  })

  return Response.json({ response: response })
}
