"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";

import Link from "next/link";
import CreateChapterModal from "@/components/createNewChapter/page";
import { getCreatorsById, getTagsById } from "@/lib/actions";
/* 
Section (Trending, TOp Rated etc) -> MangaDetail -> ChapterRead
*/
const MangaDetail = ({
  searchParams,
}: {
  searchParams: {
    id: number;
    chapter_id: number;
  };
}) => {
  const manga_id = searchParams.id;
  const chapter_id = searchParams.chapter_id;
  const [authors, setAuthors] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [format, setFormat] = useState<any[]>([]);
  const [origin, setOrign] = useState<any[]>([]);
  const [mangaInfo, setMangaInfo] = useState<any>(null); // Use Manga type
  // const [backgroundCover, setBackgroundCover] = useState<any>(null); Obsolete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestChapter, setLatestChapter] = useState<number | undefined>();
  // Fetch specific manga data, including title, description, genres, authors etc using api route from NestJs
  useEffect(() => {
    const getManga = async () => {
      const query = await fetch(`http://localhost:7000/manga/${manga_id}`);
      const response = await query.json();
      //console.log(response);
      console.log(manga_id);
      setMangaInfo(response); // set it to
    };

    getManga();
  }, [manga_id]);

  // Fetching authors, artists, tags
  useEffect(() => {
    const fetchingCreator = async () => {
      const [creatorsData, tagsData] = await Promise.all([
        getCreatorsById(manga_id),
        getTagsById(manga_id),
      ]);
      const { authors, artists } = creatorsData;
      setAuthors(authors.map((author: any) => author.creators.name));
      setArtists(artists.map((artist: any) => artist.creators.name));
      setThemes(tagsData.filter((tag: any) => tag.tags?.tag_type === "themes"));
      setGenres(tagsData.filter((tag: any) => tag.tags?.tag_type === "genres"));
    };
    fetchingCreator();
  }, []);

  // Setting the latest chapter
  useEffect(() => {
    setLatestChapter(
      mangaInfo?.chapters?.length
        ? Math.max(
            ...mangaInfo.chapters.map((chapter: any) => chapter.chapter_number)
          )
        : 0
    );
  }, [mangaInfo]);

  const refreshPage = () => {
    window.location.reload();
  };

  // Fetch the background cover for manga from cloudinary using api route directly in nextjs
  // Obsolete ?
  // useEffect(() => {
  //   const getBackgroundCover = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:3000/api/cloudinary/fetchBgCover",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ manga_id }),
  //         }
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch images");
  //       }
  //       const data = await response.json();
  //       setBackgroundCover(data?.data || []);
  //     } catch (error) {
  //       console.error("Error fetching images:", error);
  //     }
  //   };

  //   getBackgroundCover();
  // }, [manga_id]);

  return (
    <div className="bg-gray-900 min-h-screen w-screen">
      <div className="mx-20 px-5 default-style bg-gray-100">
        {isModalOpen && (
          <CreateChapterModal
            setIsOpen={setIsModalOpen}
            mangaInfo={mangaInfo}
            onSuccess={refreshPage}
          />
        )}
        {mangaInfo && (
          <>
            {/* Manga Name */}
            <div className="font-bold text-2xl mb-5 font-mono p-3 shadow-md rounded-md">
              <p>
                {mangaInfo.title}{" "}
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold 
  ${
    mangaInfo.content_rating.toLowerCase() === "safe"
      ? "bg-green-100 text-green-800 border border-green-200"
      : mangaInfo.content_rating.toLowerCase() === "suggestive"
        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
        : mangaInfo.content_rating.toLowerCase() === "ecchi"
          ? "bg-orange-100 text-orange-800 border border-orange-200"
          : mangaInfo.content_rating.toLowerCase() === "nsfw"
            ? "bg-red-100 text-red-800 border border-red-200"
            : ""
  }`}
                >
                  {mangaInfo.content_rating}
                </span>
              </p>
            </div>

            {/* Manga Detail */}

            <div className="flex p-3 pb-8 shadow-md rounded-md">
              <div className="relative bg-red-500 w-fit h-fit">
                <img
                  src={mangaInfo.cover_image_url}
                  alt="manga"
                  className="w-[15vw] h-[20vw] rounded-md"
                />
                <p className="absolute top-0 right-2 text-[1.5vw]">
                  {mangaInfo.original_lan}
                </p>
              </div>
              <div className="flex flex-col space-y-5 px-10 py-3 text-2xl">
                <div className="flex flex-col gap-2">
                  {/* Status */}
                  <div className="flex font-semibold">
                    <p className="">Status:&nbsp;</p>
                    <p
                      className={`${
                        mangaInfo.status === "Ongoing"
                          ? "text-green-400"
                          : mangaInfo.status === "Completed"
                            ? "text-blue-400"
                            : "text-orange-300"
                      }`}
                    >
                      {mangaInfo.status}
                    </p>
                  </div>

                  {/* Alternative Titles */}
                  <div className="flex">
                    <p className="font-semibold">Alternative Titles:&nbsp;</p>
                    <div className="inline-flex space-x-3">
                      {/* {mangaInfo.alternative_titles.join("; ") ||
                        "Not Specified"} */}
                      {mangaInfo.alternative_titles.map(
                        (title: any, index: any) => (
                          <p className="" key={index}>
                            {title.flag} {title.content}
                            {index < mangaInfo.alternative_titles.length - 1 &&
                              "; "}
                          </p>
                        )
                      ) || "Not Specified"}
                    </div>
                  </div>
                  {/* Author(s)  */}
                  <div className="flex">
                    <p className="font-semibold">Author(s):&nbsp;</p>

                    <ul className="space-x-3">
                      {authors.map((author: any, index: number) => (
                        <li
                          key={index}
                          className="inline-flex bg-gray-400 rounded-full px-3 py-1 text-base text-white hover:cursor-pointer font-bold hover:text-black transition-all duration-500"
                        >
                          {author}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Artist(s)  */}
                  <div className="flex">
                    <p className="font-semibold">Artist(s):&nbsp;</p>

                    <ul className="space-x-3">
                      {artists.map((artist: any, index: number) => (
                        <li
                          key={index}
                          className="inline-flex bg-gray-400 rounded-full px-3 py-1 text-base text-white hover:cursor-pointer font-bold hover:text-black transition-all duration-500"
                        >
                          {artist}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Genres */}
                  <div className="flex">
                    <p className="font-semibold">Genres(s):&nbsp;</p>
                    <div className="flex space-x-2">
                      {genres.map((genre: any, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-400 rounded-full px-3 py-1 text-base text-white hover:cursor-pointer font-bold hover:text-black transition-all duration-500"
                        >
                          {genre.tags.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Themes */}
                  <div className="flex">
                    <p className="font-semibold">Themes(s):&nbsp;</p>
                    <div className="flex space-x-2">
                      {themes.map((theme: any, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-400 rounded-full px-3 py-1 text-base text-white hover:cursor-pointer font-bold hover:text-black transition-all duration-500"
                        >
                          {theme.tags.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View Counts */}
                  <div className="flex">
                    <p className="font-semibold">View Counts:&nbsp;</p>
                    <p className="text-orange-400">{mangaInfo.view_counts}</p>
                  </div>

                  {/* Latest Chapter */}
                  <div className="flex">
                    <p className="font-semibold">Latest Chapter:&nbsp;</p>
                    <p>{latestChapter ? latestChapter : "No Chapter"}</p>
                  </div>

                  {/* Update */}
                  <div className="flex">
                    <p className="font-semibold">Update:&nbsp;</p>
                    <p className="text-pink-400">
                      {new Date(mangaInfo.last_updated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="flex flex-col p-3  border-opacity-50 shadow-md rounded-md py-5">
              <p className=" border-b-gray-300 border-b-2 text-xl py-1 font-semibold font-serif text-orange-500">
                SUMMARY
              </p>
              <p className="text-black text-justify text-xl leading-relaxed whitespace-pre-line">
                {mangaInfo.description}
              </p>
            </div>

            {/* List of All Chapters */}
            <div className="flex flex-col p-3 border-opacity-50 shadow-md rounded-md py-8 ">
              <div className="flex justify-between w-full border-b-2 border-b-gray-300">
                <p className=" text-xl py-1 font-semibold font-serif text-orange-500">
                  CHAPTERS
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none"
                >
                  Upload New Chapter
                </button>
              </div>
              {mangaInfo.chapters ? (
                <ul>
                  {mangaInfo.chapters.map((chapter: any, index: any) => (
                    <li
                      className="flex items-center justify-between border-b-2 border-b-gray-200 py-4  hover:bg-gray-100"
                      key={index}
                    >
                      <div className="flex flex-col">
                        <Link
                          className="font-semibold text-lg hover:font-bold hover:cursor-pointer"
                          href={{
                            pathname: "/ChapterRead",
                            query: {
                              chapter_id: chapter.chapter_number,
                              manga_id: manga_id,
                            },
                          }}
                        >
                          Chapter {chapter.chapter_number}
                        </Link>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(chapter.uploaded_date).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No Chapter Available</p>
              )}
            </div>

            {/* COMMENT SECTION (NOT YET IMPLEMETED) */}
            <div className="flex flex-col p-3 mb-5 space-y-3 border-opacity-50 shadow-lg py-8">
              <p className="border-b-2 border-b-gray-300 text-xl py-1 font-semibold font-serif text-orange-500">
                COMMENTS
              </p>
              <div
                className="h-auto overflow-hidden resize-none whitespace-pre-wrap border-2 p-2 border-gray-300"
                style={{ borderRadius: "20px" }}
                contentEditable="true"
              ></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MangaDetail;
