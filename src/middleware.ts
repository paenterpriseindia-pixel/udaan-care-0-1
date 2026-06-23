import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;

    // Admin routes: only ADMIN or DOCTOR
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      if (!token || (role !== "ADMIN" && role !== "DOCTOR")) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    // Portal routes: only PARENT
    if (pathname.startsWith("/portal") && pathname !== "/portal/login") {
      if (!token || role !== "PARENT") {
        return NextResponse.redirect(new URL("/portal/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Always allow login pages
        if (pathname === "/admin/login" || pathname === "/portal/login") return true;
        // Require auth for /admin and /portal
        if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
