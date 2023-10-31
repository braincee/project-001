import { db } from '@/db/drizzle'
import { caption } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
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
