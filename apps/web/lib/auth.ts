"use server";

/* 
This directive indicates that the file contains server-side code, specifically for use in a Next.js app with server components or server actions. 
This ensures the function runs only on the server, not in the browser.

*/
import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { FormState, SignupFormSchema, SignInFormSchema, FormStateManga } from "./type";
import { createSession, updateTokens } from "./session";
import { error } from "console";
// every function in this file will be a server action
// Sign Up Server Action function
export async function signUp(
  /* 
Parameters:
state: A FormState object, likely containing the initial state or error state of the form.
formData: A FormData object containing user-submitted form fields.

*/
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // validate the form data with safeParse
  /* 
    Behavior: safeParse() also validates the data, but instead of throwing an error when validation fails, 
  it returns an object containing either the parsed data or the error details.

{ success: true, data: parsedData } // if valid
{ success: false, error: ZodError } // if invalid
    */
  const validationFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  // This section handles sending validated form data to the backend and managing the response.

  // 1. fetch API Call
  //    - Sends a POST request to the backend URL stored in BACKEND_URL.
  //    - Parameters:
  //      - method: "POST" indicates data submission.
  //      - headers: "Content-Type: application/json" specifies the data format.
  //      - body: Contains the validated form data (converted to a JSON string).
  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationFields.data),
  });
  if (response.ok) {
    console.log(`${BACKEND_URL}/auth/signup`);
    redirect("/auth/signin");
  } else
    return {
      message:
        response.status === 409
          ? "The user is already existed!"
          : response.statusText,
    };
}

// Sign In Server Action function
export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationFields.success)
    return {
      error: validationFields.error.flatten().fieldErrors,
    };

  const response = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationFields.data),
  });

  if (response.ok) {
    const result = await response.json();

    // Create the session for authenticated user
    await createSession({
      user: {
        id: result.id, // the result is a resolved response object from the backend api
        name: result.name,
        role: result.role,
      },
      accessToken: result.accessToken, // this is the resolved object of the post request to the backend api
      refreshToken: result.refreshToken,
    });
    redirect("/"); // redirect user  to home page
    //console.log({result})
  } else {
    return {
      message:
        response.status === 401
          ? "Invalid credentials. Please check your email/password"
          : `cannot found any api route at ${BACKEND_URL}/auth/signin`, // here is important, check in auth.controller, the api route must match here, for example, the api route for signing in is /auth/signin, so it must be http:8000/auth/signin
    };
  }
}

// Refresh Token server action function
export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      body: JSON.stringify({
        refresh: oldRefreshToken,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const { accessToken, refreshToken } = await response.json();
    // update the session with new tokens
    // await updateTokens({accessToken, refreshToken})
    const updateRes = await fetch("http://localhost:3000/api/auth/update", {
      method: "POST",
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });
    if (!updateRes) throw new Error("Failed to update the tokens");
    return accessToken;
  } catch (err) {
    console.log("Refresh token failed:", err);
    return null;
  }
};


// GET corresponding manga with mangaId
export async function fetchManga(mangaId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/manga/${mangaId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch manga");
    }
    const manga = await res.json();
    return manga;
  } catch (error) {
    console.error("Error fetching manga:", error);
    return null;
  }
}


// export async function addManga(state: FormStateManga, formData: FormData){
//   const validationFields = AddNewMangaFormSchema.safeParse({
//     name: formData.get("name"),
//     email: formData.get("email"),
//     password: formData.get("password"),
//   });

//   if (!validationFields.success) {
//     return {
//       error: validationFields.error.flatten().fieldErrors,
//     };
//   }
// }
