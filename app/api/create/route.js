import { db } from '../../../libs/drizzle/db'
import { polls } from '../../../libs/drizzle/schema'

export async function POST(req) {
  const { options, pollId } = req.json()
  const date = new Date()
  const response = await db.insert(polls).values({
    id: pollId,
    options: JSON.stringify(options),
    createdAt: date,
  })

  return Response.json(response)
}
