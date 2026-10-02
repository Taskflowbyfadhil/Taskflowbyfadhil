import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Tambahkan log ini untuk melihat status kunci di Console Browser/Vercel
  console.log("Supabase URL loaded:", supabaseUrl ? "YES (Present)" : "NO (Missing)")
  console.log("Supabase Key loaded:", supabaseKey ? "YES (Present)" : "NO (Missing)")

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Anon Key is missing from environment variables!")
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}