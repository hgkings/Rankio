import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Role-based route protection
    const pathname = request.nextUrl.pathname

    // Protected routes that require authentication
    const isAppRoute = pathname.startsWith('/app')
    const isStudioRoute = pathname.startsWith('/studio')
    const isAdminRoute = pathname.startsWith('/admin')

    if (isAppRoute || isStudioRoute || isAdminRoute) {
        if (!user) {
            // Redirect to login if not authenticated
            const url = request.nextUrl.clone()
            url.pathname = '/auth/login'
            return NextResponse.redirect(url)
        }

        // Fetch user profile to check role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile) {
            // Fan trying to access studio or admin
            if (profile.role === 'fan' && (isStudioRoute || isAdminRoute)) {
                const url = request.nextUrl.clone()
                url.pathname = '/app/dashboard'
                return NextResponse.redirect(url)
            }

            // Creator trying to access fan app
            if (profile.role === 'creator' && isAppRoute) {
                const url = request.nextUrl.clone()
                url.pathname = '/studio/dashboard'
                return NextResponse.redirect(url)
            }

            // Non-admin trying to access admin routes
            if (profile.role !== 'admin' && isAdminRoute) {
                const url = request.nextUrl.clone()
                url.pathname = profile.role === 'creator' ? '/studio/dashboard' : '/app/dashboard'
                return NextResponse.redirect(url)
            }
        }
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}
