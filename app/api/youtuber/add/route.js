import supabase from '@/libs/supabase'

export async function POST(req, res) {
  const {
    youtuberData: { name, id },
  } = req.json()
  const { data, error } = await supabase.from('youtuber').insert({ name, id })

  return Response.json(data ?? error)
}
