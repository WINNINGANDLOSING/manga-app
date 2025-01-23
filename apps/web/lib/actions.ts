"use server";

import React from "react";
import { getSession } from "./session";
import { BACKEND_URL } from "./constants";
import { authFetch } from "./authFetch";
import exp from "constants";
import { redirect } from "next/navigation";
import { CreateMangaPage1Schema, FormState, FormStateManga, Role } from "./type";

/* 


Bearer token format: The Authorization header is generally used for sending credentials in HTTP requests. The common format when using JWT (JSON Web Tokens) is:

Authorization: Bearer <token>
The Bearer keyword followed by a space and the token is the correct format recognized by most APIs for bearer authentication.

*/

// fetch() takes two arguments, the url and the headers (which contain the authorization)
export const getProfile = async () => {
  // const session = await getSession();
  // const response = await fetch(`${BACKEND_URL}/auth/protected`, { // call the /auth/protected api, which return a short message that states the user id
  //   headers: {
  //     authorization: `Bearer ${session?.accessToken}`,
  //   },
  // });
  // const result = await response.json();
  // return result;

  const response = await authFetch(`${BACKEND_URL}/auth/protected`); // sent to the protected api, which has the required roles admin and editor only
  // AND remember to put await here or else all roles can access this api, IMPORTANT!!!
  const result = await response.json();
  return result;
};

export const getAllManga = async () => {
  //const checking = await authFetch(`${BACKEND_URL}/auth/protected`);
  const response = await authFetch(`${BACKEND_URL}/manga`);
  const result = await response.json();
  return result;
};

export const getAllUsers = async () => {
  const response = await authFetch(`${BACKEND_URL}/user`);
  const result = await response.json();
  return result;
};

export const getAllTags = async () => {
  const response = await authFetch(`${BACKEND_URL}/tag`);
  const result = await response.json();
  return result;
};

export const addNewChapter = async (
  manga_id: string,
  latestChapter: number
) => {
  const response = await authFetch(
    `http://localhost:7000/manga/createNewChapter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mangaId: manga_id,
        chapterNumber: latestChapter + 1, // send this to the createChapterDto
      }),
    }
  );
  const result = await response.json();
  return result;
};

export const getAllCreators = async () => {
  const response = await authFetch(`${BACKEND_URL}/creators`);
  const result = await response.json();

  return result;
};

export const getCreatorsById = async (manga_id: number) => {
  const response = await fetch(
    `http://localhost:7000/manga/creators/${manga_id}`
  );
  const result = await response.json();
  const authors = result.filter((creator: any) => creator.role === "author");
  const artists = result.filter((creator: any) => creator.role === "artist");
  return { authors, artists };
};

export const addNewManga = async (
  title: string,
  description: string,

  genres: string[],
  cover_image_url: string,
  view_counts: 0,
  status: string
) => {
  const response = await authFetch(
    `http://localhost:7000/manga/createNewManga`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,

        genres: genres,
        cover_image_url: cover_image_url,
        view_counts: view_counts,
        status: status,
      }),
    }
  );
  const result = await response.json();
  return result;
};

export const checking = async () => {
  const session = await getSession();
  if (!session || !session.user) redirect("/auth/signin");
  if (session.user.role !== Role.ADMIN) redirect("/auth/signin");
};



export async function handleMangaPage1Submission(
  state: FormStateManga,
  formData: FormData
): Promise<FormStateManga> {

  const validationFields = CreateMangaPage1Schema.safeParse({
    title: formData.get("title"),
    coverImage: formData.get("coverImage"),
    synopsis: formData.get("synopsis"),
    alternateTitles:formData.get("alternateTitles") || "[]",
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  


    const response = await fetch("/api/manga", {
      method: "POST",
      body: JSON.stringify(validationFields.data),
      headers: { "Content-Type": "application/json" },
    });

   if (response.ok) {
     
     redirect("/auth/signin");
   } else
     return {
       message:
         response.status === 409
           ? "The user is already existed!"
           : response.statusText,
     };
  
}
