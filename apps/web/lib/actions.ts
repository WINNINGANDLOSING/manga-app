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
import axios from "axios";

interface AlternativeTitle {
  flag: string;
  content: string;
}
interface Creator {
  id: number;
  name: string;
}
interface Creator1 {
  name: any;
  role: any;
}
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
export const getMangaById = async (id: string) => {
  const response = await authFetch(`${BACKEND_URL}/manga/${id}`);
  const result = await response.json();
  return result;
};

export const getMangaByTag = async (tag: string) => {
  const response = await authFetch(`${BACKEND_URL}/manga/tag/${tag}`);
  const result = await response.json();
  return result;
};

export const getMangaByCreator = async (creator: string) => {
  const response = await authFetch(`${BACKEND_URL}/manga/creator/${creator}`);
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

// export const addNewManga = async (
//   title: string,
//   alternative_titles: string[],
//   description: string,
//   authors: string[],
//   artists: string[],
//   originalLanguage: string,
//   releaseYear: number,
//   content_rating: string,
//   origin: string,
//   formats: string[],
//   genres: string[],
//   themes: string[],
//   cover_image_url: string

//   // status: string
// ) => {
//   const response = await authFetch(
//     `http://localhost:7000/manga/createNewManga`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         title: title,
//         description: description,
//         alternative_titles: alternative_titles,
//         authors: authors,
//         artists: artists,
//         originalLanguage: originalLanguage,
//         releaseYear: releaseYear,
//         content_rating: content_rating,
//         origin: origin,
//         formats: formats,
//         genres: genres,
//         themes: themes,
//         cover_image_url: cover_image_url,
//       }),
//     }
//   );
//   const result = await response.json();
//   return result;
// };

export const addNewManga = async (
  title: string,
  alternative_titles: string[],
  description: string,
  authors: string[],
  artists: string[],
  originalLanguage: string,
  releaseYear: number,
  content_rating: string,
  tags: string[],
  cover_image_url: string

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
        alternative_titles: alternative_titles,
        description: description,
        authors: authors,
        artists: artists,
        originalLanguage: originalLanguage,
        releaseYear: releaseYear,
        content_rating: content_rating,
        tags: tags,
        cover_image_url: cover_image_url,
      }),
    }
  );
  const result = await response.json();
  return result;
};


export const editManga = async (
  manga_id: string,
  title: string,
  alternative_titles: AlternativeTitle[],
  description: string,
  creators: Creator1[],
  originalLanguage: string | undefined,
  releaseYear: number,
  content_rating: string,
  tags: string[],
  cover_image_url: string,
  status: string
) => {
  const response = await authFetch(`http://localhost:7000/manga/editManga`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      manga_id: manga_id,
      title: title,
      description: description,
      alternative_titles: alternative_titles,
      creators: creators,
      originalLanguage: originalLanguage,
      releaseYear: releaseYear,
      content_rating: content_rating,
      tags: tags,
      cover_image_url: cover_image_url,
      status: status,
    }),
  });
  const result = await response.json();
  return result;
};

export const checking = async () => {
  const session = await getSession();
  if (!session || !session.user) redirect("/auth/signin");
  if (session.user.role !== Role.ADMIN) redirect("/auth/signin");
};

export const searchMangaDex = async (title: string) => {
  const axios = require("axios");

  const baseURL = "http://api.mangadex.org";

  const order = {
    relevance: "desc",
  };
  const finalOrderQuery: Record<string, string> = {};

  Object.entries(order).forEach(([key, value]) => {
    finalOrderQuery[`order[${key}]`] = value;
  });
  const response = await axios({
    method: "GET",
    url: `${baseURL}/manga`,
    params: {
      title: title,
      ...finalOrderQuery,
    },
  });

  const res = response.data.data;

  return res;
};

export const getCoverImageMangaDex = async (data: any) => {
  try {
    const mangaId = data.id;
    const coverRelationship = data.relationships.find(
      (rel: any) => rel.type === "cover_art"
    );

    if (!coverRelationship) {
      throw new Error("Cover art not found in relationships.");
    }

    const coverId = coverRelationship.id;
    const coverResponse = await axios.get(
      `https://api.mangadex.org/cover/${coverId}`
    );
    const fileName = coverResponse.data.data.attributes.fileName;
    return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
  } catch (error) {
    console.error("Error fetching cover image:", error);
    return null;
  }
};

export const getCreatorsMangaDex = async (data: any) => {
  try {
    const authorList = data.relationships.filter(
      (rel: any) => rel.type === "author"
    );
    const artistList = data.relationships.filter(
      (rel: any) => rel.type === "artist"
    );

    //const mangaId = data.id;

    const authorPromises = authorList.map((author: any) =>
      axios.get(`https://api.mangadex.org/author/${author.id}`)
    );
    const artistPromises = artistList.map((artist: any) =>
      axios.get(`https://api.mangadex.org/author/${artist.id}`)
    );
    const authorResponses = await Promise.all(authorPromises);
    const artistResponses = await Promise.all(artistPromises);
    
    const authorNames = authorResponses.map(
      (res) => res.data.data.attributes.name
    );

    const artistNames = artistResponses.map(
      (res) => res.data.data.attributes.name
    );
    return {
      authorNames,
      artistNames,
    };
  } catch (err) {
    console.error("Error fetching creators:", err);
    return { authorName: null, artistName: null }; // Return a fallback object
  }
};
