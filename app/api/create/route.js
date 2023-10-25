import supabase from '@/libs/supabase'

export async function POST(req) {
  const { options, pollId } = req.json()
  const { data, error } = await supabase
    .from('polls')
    .insert({ id: pollId, options: JSON.stringify(options) })

  return Response.json(data ?? error)
}
