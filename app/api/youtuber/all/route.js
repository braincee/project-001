import supabase from '@/libs/supabase'

export async function GET() {
  const { data, error } = await supabase.from('youtuber').select()

  return Response.json(data ?? error)
}
