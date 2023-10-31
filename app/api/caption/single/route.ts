import { db } from '@/db/drizzle'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') as string
  const response = await db.query.caption.findMany({
    where: (caption, { eq }) => eq(caption.videoId, id),
  })

  return Response.json(response)
}
