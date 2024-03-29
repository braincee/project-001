import { db } from '../../../../libs/drizzle/db'
import { youtuber } from '../../../../libs/drizzle/schema'

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
