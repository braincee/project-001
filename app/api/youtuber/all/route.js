import supabase from '@/libs/supabase'
import { db } from '../../../../libs/drizzle/db'

export async function GET() {
  const response = await db.query.youtuber.findMany()

  return Response.json(response)
}
