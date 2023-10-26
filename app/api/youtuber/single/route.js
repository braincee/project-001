import supabase from '@/libs/supabase'
import { db } from '../../../../libs/drizzle/db'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const channelId = searchParams.get('channelId')
  const response = await db.query.youtuber.findMany({
    where: (youtuber, { eq }) => eq(youtuber.id, channelId),
  })

  return Response.json(response)
}
