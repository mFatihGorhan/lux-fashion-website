import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin paneli koruması
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (!token) {
        const loginUrl = new URL('/admin/login', req.url)
        return NextResponse.redirect(loginUrl)
      }

      if (token.role !== 'ADMIN') {
        const homeUrl = new URL('/', req.url)
        return NextResponse.redirect(homeUrl)
      }
    }

    // Login sayfasına giriş yapmış admin erişirse dashboard'a yönlendir
    if (pathname === '/admin/login' && token?.role === 'ADMIN') {
      const dashboardUrl = new URL('/admin/dashboard', req.url)
      return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl
        
        // Admin login sayfası herkese açık
        if (pathname === '/admin/login') {
          return true
        }

        // Admin paneli sadece admin'e açık
        if (pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }

        // Diğer sayfalar herkese açık
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}