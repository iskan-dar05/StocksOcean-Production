import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = req.nextUrl.pathname

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profileRole = 'user'

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    profileRole = String(profile?.role || 'user').toLowerCase()
  }

  if (
    !user &&
    (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/contributor') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/favorites')
    )
  ) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  if (pathname.startsWith('/become-contributor')) {
    if (profileRole !== 'user') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // ✅ Auth routing
  if (user) {
    if (profileRole === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    if (profileRole === 'contributor') {
      return NextResponse.redirect(new URL('/contributor/dashboard', req.url))
    }

    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/contributor/:path*', '/dashboard/:path*', '/become-contributor'],
}