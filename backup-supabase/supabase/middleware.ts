import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockAuth } from '@/lib/mock/auth'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function updateSession(request: NextRequest) {
  if (USE_MOCK) {
    return handleMockSession(request);
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return supabaseResponse
}

function handleMockSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  const user = mockAuth.getUser();

  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  if (pathname.startsWith('/auth/') && user) {
    const userType = user.user_metadata?.user_type;
    if (userType === 'A') {
      return NextResponse.redirect(new URL('/dashboard/buyer', request.url));
    } else if (userType === 'B') {
      return NextResponse.redirect(new URL('/dashboard/supplier', request.url));
    }
  }

  return response;
}