import { updateTokens } from "@/lib/session";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    // expect the access token and refresh token from the body of the incoming post request
    const body = await req.json();

    const {accessToken, refreshToken} = body;
    if (!accessToken || !refreshToken)
      return new Response("Provide Tokens", { status: 401 });
    // call the updateTokens function to update both
    await updateTokens({accessToken, refreshToken});
    return new Response("OK", {status: 200});
}