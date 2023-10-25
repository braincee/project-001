import supabase from '@/libs/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function GET(req) {
  const { pollId } = req.json()
  const { data, error } = await supabase
    .from('votes')
    .select()
    .eq('poll', pollId)

  return Response.json(data ?? error)
}

export async function POST(req) {
  const { pickedOption, pollId } = req.json()
  const { data, error } = await supabase
    .from('votes')
    .insert({ id: uuidv4(), picked_option: pickedOption, poll: pollId })

  return Response.json(data ?? error)
}
