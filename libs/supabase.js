import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://pztcvcpnqbocxaowaxmr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6dGN2Y3BucWJvY3hhb3dheG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc5MDMzOTgsImV4cCI6MjAwMzQ3OTM5OH0.AqcZgWXB1fIDxQCWdejroJeU89c-V-WhtRJRJmUVtqI')

export default supabase