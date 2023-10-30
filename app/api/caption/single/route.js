import { db } from '../../../../db/drizzle'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const response = await db.query.caption.findMany({
    where: (caption, { eq }) => eq(caption.videoId, id),
  })

  return Response.json(response)
}
