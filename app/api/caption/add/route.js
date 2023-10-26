import { db } from '../../../../libs/drizzle/db'
import { caption } from '../../../../libs/drizzle/schema'

export async function POST(req) {
  const {
    captionData: {
      videoId,
      videoTitle,
      thumbnail,
      youTuberId,
      captionChunks,
      transcribedWithLyrics,
    },
  } = req.json()

  const date = new Date()
  const response = await db.insert(caption).values({
    videoId,
    videoTitle,
    thumbnail,
    youTuberId,
    captionChunks,
    transcribedWithLyrics,
    createdAt: date,
  })

  return Response.json(response)
}
