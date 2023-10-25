import supabase from '@/libs/supabase'

export async function GET(req) {
  const { id } = req.json()
  const { data, error } = await supabase
    .from('caption')
    .select()
    .eq('videoId', id)

  return Response.json(data ?? error)
}
