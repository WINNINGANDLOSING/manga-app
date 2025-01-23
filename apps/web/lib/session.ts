"use server"; // ensure this is run on the server
import { jwtVerify, SignJWT } from "jose";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Role } from "./type";

// Create session function
export type Session = {
  user: {
    id: string;
    name: string;
    role: Role
  };
  accessToken: string;
  refreshToken: string;
};

const secret_key = process.env.SESSION_SECRET_KEY!;
const encoded_key = new TextEncoder().encode(secret_key);
export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // will be expired 7 days from now

  // keep the session inside a http only cookie, accessible on this server, cannot access this type of cookie using javascript

  // encrypt the session, the session here is the encrypted version of the payload that is fed to the createSession function
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoded_key); // embed the creation time of the jwt

  cookies().set("session", session, {
    httpOnly: true, // keep the cookie accessible only the server
    secure: true, // ensure the cookie is only sent over the HTTP connection
    expires: expiredAt,
    sameSite: "lax", // prevent cross site request or csrf attack
    path: "/", // define the url in which the cookie is valid, the cookie here is valid globally - the cookiie will be sent with any request to the domain
  });
}

// Getting session function
export async function getSession() {
  // retrieve the cookie
  const cookie = cookies().get("session")?.value; // the same name as above "session"

  // if there is no cookie with this name
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encoded_key, {
      algorithms: ["HS256"],
    }); // param: cookie, encoded key, an object containig the algoritm

    return payload as Session;
  } catch (err) {
    console.log("failed to verify the session", err);
    redirect("/publicPage");
  }
}

// Delete session function, necessary for signing out

export async function deleteSession() {
  await cookies().delete("session");
}

// create a new sesssion with the new payload, replace teh session cookike with this new payload that actualy has new access token and refresh token
export async function updateTokens({
  // This function takes an object with accessToken and refreshToken as parameters. These tokens will be used to update the session.
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  // Retrieve the session cookie, which contains the user's current session data.
  const cookie = cookies().get("session")?.value;
  // If no session cookie is found, return null to indicate there's no session data to update.
  if (!cookie) return null;

  // Verify the JWT stored in the cookie with the encoded key to decode and validate the session data.
  /*
  It then verifies the session JWT (stored in the cookie) using the jwtVerify function and the encoded_key (which is probably a secret key). 
  The function expects the session JWT to be in a valid format and decodes it to retrieve the payload, which contains the session data (e.g., user information, access token, etc.).
  jwtVerify<Session>: This function is generic and expects the decoded payload to match the Session type (a predefined interface or type).  
  encoded_key: The secret key used to verify the JWT's authenticity.

  */
  const { payload } = await jwtVerify<Session>(cookie, encoded_key);

  // If no payload is returned (i.e., the session is invalid or expired), throw an error.
  if (!payload) throw new Error("Session new payload");

  // Create a new payload object that includes the user data and the new access/refresh tokens.
  /* 
  The function then creates a new payload (newPayload) for the session. This payload includes:
    user: It copies over the user data from the original payload (payload.user).
    accessToken: The new accessToken passed to the function.
    refreshToken: The new refreshToken passed to the function.

  */
  const newPayload: Session = {
    // create new payload
    user: {
      ...payload.user, // Copy the current user data from the old session
    },
    accessToken, // Set the new access token.
    refreshToken, // Set the new refresh token.
  };

  await createSession(newPayload); // Save or update the session with the new payload data (including the new tokens).
}
