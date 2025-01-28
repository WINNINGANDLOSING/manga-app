"use server";

import React from "react";
import { getSession } from "./session";
import { BACKEND_URL } from "./constants";
import { authFetch } from "./authFetch";
import exp from "constants";
import { redirect } from "next/navigation";
import {
  CreateMangaPage1Schema,
  FormState,
  FormStateManga,
  Role,
} from "./type";

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

export const getTagsById = async (mangaId: number) => {
  const response = await authFetch(`${BACKEND_URL}/tag/${mangaId}`);
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
  const response = await fetch(`http://localhost:7000/creators/${manga_id}`);
  const result = await response.json();
  const authors = result.filter((creator: any) => creator.role === "author");
  const artists = result.filter((creator: any) => creator.role === "artist");
  return { authors, artists };
};

export const addNewManga = async (
  title: string,
  alternative_titles: string[],
  description: string,
  authors: string[],
  artists: string[],
  originalLanguage: string,
  releaseYear: number,
  content_rating: string,
  origin: string,
  formats: string[],
  genres: string[],
  themes: string[],
  cover_image_url: string

  // status: string
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
        alternative_titles: alternative_titles,
        authors: authors,
        artists: artists,
        originalLanguage: originalLanguage,
        releaseYear: releaseYear,
        content_rating: content_rating,
        origin: origin,
        formats: formats,
        genres: genres,
        themes: themes,
        cover_image_url: cover_image_url,
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
