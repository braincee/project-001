import { db } from '@/db/drizzle'

export async function GET() {
  const response = await db.query.caption.findMany()

  return Response.json(response)
}
