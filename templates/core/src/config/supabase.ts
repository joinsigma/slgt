import { createClient } from '@supabase/supabase-js'
import Environment from './environment'

const supabase = createClient(
  Environment.config().supabaseUrl,
  Environment.config().supabaseAnonKey
)

export default supabase
