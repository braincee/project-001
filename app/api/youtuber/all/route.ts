import { db } from '@/db/drizzle'

export async function GET() {
  const response = await db.query.youtuber.findMany()

  return Response.json(response)
}
