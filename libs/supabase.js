import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pztcvcpnqbocxaowaxmr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6dGN2Y3BucWJvY3hhb3dheG1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NzkwMzM5OCwiZXhwIjoyMDAzNDc5Mzk4fQ.ujEdy9cMNdIyGDnMAij24mFUvEjYuI2zqD0HXDOgQuA';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
