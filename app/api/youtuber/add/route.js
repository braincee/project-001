import { db } from '../../../../db/drizzle'
import { youtuber } from '../../../../db/schema'

export async function POST(req) {
  const {
    youtuberData: { name, id },
  } = await req.json()
  const date = new Date()
  const response = await db
    .insert(youtuber)
    .values({ name, id, createdAt: date })

  return Response.json(response)
}
