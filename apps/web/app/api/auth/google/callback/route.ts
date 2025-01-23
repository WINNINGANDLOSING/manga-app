import { createSession, updateTokens } from "@/lib/session";
import { Role } from "@/lib/type";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // expect the access token and refresh token from the body of the incoming post request
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const userId = searchParams.get("userId");
  const name = searchParams.get("name");
  const role = searchParams.get("role");
  if (!accessToken || !refreshToken || !userId || !name || !role)
    throw new Error("Google OAuth Failed!");

  // Create an session object
  await createSession({
    user: {
      id: userId,
      name: name,
      role: role as Role,
    },
    accessToken,
    refreshToken,
  });

  // After creating the session, redirect to the homepage
  redirect("/");
}
