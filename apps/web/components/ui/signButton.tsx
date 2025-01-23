import { getSession } from "@/lib/session";
import React from "react";
import Link from "next/link";
const SignButton = async () => {
  const session = await getSession();
  return (
    <div className="flex items-center gap-2">
      {/* user is not authenticated or we have a session but it doesn't have a user*/}
      {!session || !session.user ? (
        <>
          <Link href={"/auth/signin"}>Sign In</Link>{" "}
          {/* there is a folder inside the web root dir that is /auth/signin, so the name must be /auth/signin, it will be 127.0.0.1:3000/auth/signin*/}
          <Link href={"/auth/signup"}>Sign Up</Link> {/* same as above */}
        </>
      ) : (
        <>
          <p>{session.user.name}</p>
          <Link href={"/api/auth/signout"}>Sign Out</Link>
        </>
      )}
    </div>
  );
};

export default SignButton;
