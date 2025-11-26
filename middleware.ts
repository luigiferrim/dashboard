import { default as withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname

    const isDashboardPath = 
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/estoque") ||
      pathname.startsWith("/financeiro") ||
      pathname.startsWith("/historico") ||
      pathname.startsWith("/configuracoes")

    if (isDashboardPath) {
      const accessVerified = req.cookies.get('access_verified')?.value
      
      if (!accessVerified || accessVerified !== 'true') {
        return NextResponse.redirect(new URL("/verify-access", req.url))
      }
    }

    const response = NextResponse.next()
    
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    )
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/estoque/:path*", 
    "/financeiro/:path*", 
    "/historico/:path*", 
    "/configuracoes/:path*",
    "/verify-access"
  ],
}
