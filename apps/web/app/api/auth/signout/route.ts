import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { deleteSession } from "@/lib/session";
import { redirect, RedirectType } from "next/navigation";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const respone = await authFetch('http://localhost:7000/auth/signout', {
    method: "POST",
  });
  if (respone.ok) {
  }
  await deleteSession();

  // window.location.reload();
  redirect("/", RedirectType.push);
}

// non working version
/* 
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = await authFetch(`${BACKEND_URL}/auth/signout`, {
    method: "POST",
  });
  if (response.ok) {
    await deleteSession();
  }

  revalidatePath("/", "layout"); // flash the cache
  revalidatePath("/", "page");
  /// return NextResponse.redirect(new URL("/", req.nextUrl));

  // Return a redirect response with no-cache headers to force a fresh client-side reload
  return NextResponse.redirect(new URL("/", req.nextUrl));
}


*/
