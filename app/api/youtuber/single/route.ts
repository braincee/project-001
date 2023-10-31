import { db } from '@/db/drizzle'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const channelId = searchParams.get('channelId') as string
  const response = await db.query.youtuber.findMany({
    where: (youtuber, { eq }) => eq(youtuber.id, channelId),
  })

  return Response.json(response)
}
