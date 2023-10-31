import { db } from '@/db/drizzle'
import { votes } from '@/db/schema'
import { v4 as uuidv4 } from 'uuid'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pollId = searchParams.get('pollId') as string
  const response = await db.query.votes.findMany({
    where: (vote, { eq }) => eq(vote.poll, pollId),
  })

  return Response.json(response)
}

export async function POST(req: Request) {
  const { pickedOption, pollId } = await req.json()
  const date = new Date()

  const response = await db.insert(votes).values({
    id: uuidv4(),
    picked_option: pickedOption,
    poll: pollId,
    createdAt: date,
  })
  return Response.json(response)
}
