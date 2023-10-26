import { db } from '../../../../libs/drizzle/db'
import { caption } from '../../../../libs/drizzle/schema'
import { eq } from 'cheerio/lib/api/traversing'

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
  const response = await db
    .update(caption)
    .set({
      videoTitle,
      thumbnail,
      youTuberId,
      captionChunks,
      transcribedWithLyrics,
    })
    .where(eq(caption.videoId, videoId))

  return Response.json(response)
}
