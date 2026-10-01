import { NextResponse } from 'next/server'
// Sesuaikan impor client Supabase dengan struktur folder proyek Anda (misal: utils/supabase/server)
import { createClient } from '@/utils/supabase/server' 

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Jika ada parameter 'next' di URL, arahkan ke sana, jika tidak arahkan ke halaman utama/dashboard
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // Mendukung domain Vercel / production
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Jika terjadi error saat autentikasi, kembalikan ke halaman login atau error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}