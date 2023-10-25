import { getSubtitles } from 'youtube-captions-scraper'

const fetchSubtitles = async ({
  videoId,
  defaultLanguage,
  defaultAudioLanguage,
}) => {
  try {
    const response = await getSubtitles({
      videoID: videoId,
      lang: defaultLanguage || defaultAudioLanguage || 'en',
    })
    return response
  } catch (err) {
    console.error(err)
  }
}

export async function POST(req) {
  const { videoId, defaultLanguage, defaultAudioLanguage } = req.json()
  const response = await fetchSubtitles({
    videoId,
    defaultLanguage,
    defaultAudioLanguage,
  })

  return Response.json({ response: response })
}
