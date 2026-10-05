import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Diabaikan jika dipanggil dari server component
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 1. Ambil data user yang sedang login dari sesi Supabase
      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email) {
        // 2. Cek apakah email sudah terdaftar di tabel database aplikasi Anda (contoh: tabel 'users')
        const { data: existingUser, error: dbError } = await supabase
          .from('users') // Sesuaikan dengan nama tabel user Anda di Supabase
          .select('email')
          .eq('email', user.email)
          .single()

        // 3. Jika user belum terdaftar di database
        if (dbError || !existingUser) {
          // Hapus sesi / sign out agar user tidak nyangkut dalam kondisi login
          await supabase.auth.signOut()
          
          // Redirect ke halaman login/splash screen dengan pesan error
          return NextResponse.redirect(`${origin}/login?error=email-not-registered`)
        }
      }

      // 4. Jika terdaftar, lanjutkan proses redirect normal ke dashboard
      const forwardedHost = request.headers.get('x-forwarded-host')
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

  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}