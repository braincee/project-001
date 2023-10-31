import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/env.mjs'

const supabase: SupabaseClient = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_KEY
)

export default supabase
