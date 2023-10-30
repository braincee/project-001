import { db } from '../../../../db/drizzle'
import { caption } from '../../../../db/schema'

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
  } = await req.json()

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
