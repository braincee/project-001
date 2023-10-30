import { v4 as uuidv4 } from 'uuid'
import { db } from '../../../libs/drizzle/db'
import { votes } from '../../../libs/drizzle/schema'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const pollId = searchParams.get('pollId')
  const response = await db.query.votes.findMany({
    where: (vote, { eq }) => eq(vote.poll, pollId),
  })

  return Response.json(response)
}

export async function POST(req) {
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
