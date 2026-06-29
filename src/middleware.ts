import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;

    const isApi = pathname.startsWith("/api/");

    // Admin routes: only ADMIN or DOCTOR
    // EXCEPTION: POST /api/admin/leads is used by the public Contact form
    const isPublicLeadPost = pathname === "/api/admin/leads" && req.method === "POST";
    
    if (((pathname.startsWith("/admin") && pathname !== "/admin/login") || pathname.startsWith("/api/admin")) && !isPublicLeadPost) {
      if (!token || (role !== "ADMIN" && role !== "DOCTOR")) {
        if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    // Portal routes: only PARENT
    if ((pathname.startsWith("/portal") && pathname !== "/portal/login") || pathname.startsWith("/api/portal")) {
      if (!token || role !== "PARENT") {
        if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        return NextResponse.redirect(new URL("/portal/login", req.url));
      }
    }

    // Redirect already logged in users away from login pages
    if (token) {
      if (pathname === "/admin/login" && (role === "ADMIN" || role === "DOCTOR")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      if (pathname === "/portal/login" && role === "PARENT") {
        return NextResponse.redirect(new URL("/portal", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Always allow login pages and NextAuth core APIs
        if (pathname === "/admin/login" || pathname === "/portal/login" || pathname.startsWith("/api/auth")) return true;
        
        // Let custom middleware handle API route authorization to return 401 instead of redirecting
        if (pathname.startsWith("/api/")) return true;

        // Require auth for /admin and /portal pages (will redirect if false)
        if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/api/admin/:path*", "/api/portal/:path*"],
};
