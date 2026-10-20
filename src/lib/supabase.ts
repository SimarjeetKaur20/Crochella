import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  !supabaseUrl.includes('placeholder')
)

// Lazily initialised — only created when credentials are present.
// supabase-js throws "supabaseUrl is required" at createClient() time
// (not at import time), which crashes the app before React even mounts.
let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
  }
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

// Convenience named export — same as before, but now returns null when unconfigured.
// All stores already guard with `if (!isSupabaseConfigured) return` before using this.
export const supabase = {
  from: (...args: Parameters<SupabaseClient['from']>) => getSupabase().from(...args),
  auth: {
    signInWithPassword: (...args: Parameters<SupabaseClient['auth']['signInWithPassword']>) =>
      getSupabase().auth.signInWithPassword(...args),
    signOut: (...args: Parameters<SupabaseClient['auth']['signOut']>) =>
      getSupabase().auth.signOut(...args),
    getSession: (...args: Parameters<SupabaseClient['auth']['getSession']>) =>
      getSupabase().auth.getSession(...args),
  },
  storage: new Proxy({} as SupabaseClient['storage'], {
    get(_t, prop) {
      return (getSupabase().storage as unknown as Record<string | symbol, unknown>)[prop]
    },
  }),
}
