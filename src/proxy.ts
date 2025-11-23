import { withAuth, type NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req: NextRequestWithAuth) {
        const { token } = req.nextauth;
        const { pathname } = req.nextUrl;

        if (token && pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        return NextResponse.next();
    },
    {
        pages: {
            signIn: "/login",
        },
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
                    return true;
                }

                if (!token) {
                    return false;
                }

                return true;
            },
        },
    }
)

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
}