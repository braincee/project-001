import { db } from '../../../../libs/drizzle/db'

export async function GET() {
  const response = await db.query.caption.findMany()

  return Response.json(response)
}
