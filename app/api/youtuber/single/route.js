import supabase from '@/libs/supabase'

export async function GET(req) {
  const { channelId } = req.json()
  const { data, error } = await supabase
    .from('youtuber')
    .select()
    .eq('id', channelId)

  return Response.json(data ?? error)
}
