import { createClient } from '@supabase/supabase-js'
export const supabaseClient = createClient('<Your-Public-Url>', '<Your-Anon-Key>')