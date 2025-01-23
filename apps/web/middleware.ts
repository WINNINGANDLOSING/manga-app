import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";
import { Role } from "./lib/type";

// The middleware page, serve general purpose to check if the user is authenticated or not.
// If not, redirect to the sign-in page; if yes, allow to perform the next request.
export default async function middleware(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user || session.user.role!=="ADMIN") {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }

  return NextResponse.next();
}

// Enforce it in the profile and admin interface pages
export const config = {
  matcher: [ "/admin-interface", "/privatePage"], // Added /admin-interface
};
