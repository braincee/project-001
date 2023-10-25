import supabase from '@/libs/supabase'

export async function GET() {
  const { data, error } = await supabase.from('caption').select()

  return Response.json(data ?? error)
}
