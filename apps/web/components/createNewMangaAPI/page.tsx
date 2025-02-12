"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { CLOUDINARY_CLOUD_NAME } from "@/lib/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

import {
  getAllTags,
  getAllCreators,
  addNewManga,
  getAllManga,
  searchMangaDex,
} from "@/lib/actions";
import { useFormStatus } from "react-dom";
import CreateNewSynopsisModal from "./CreateNewSynopsisModal";
import CreateNewAlternativeTitlesModal from "./CreateNewAlternativeTitles";
import CreateNewAuthors from "./CreateNewAuthors";
import CreateNewArtists from "./CreateNewArtists";

import { setupDevBundler } from "next/dist/server/lib/router-utils/setup-dev-bundler";
import Link from "next/link";
import { match } from "assert";
interface Manga {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  view_counts: number;
  // Include other fields as needed
}

const CreateMangaModalAPI = () => {
  /* Fetching matched manga titles*/
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [matchedMangaList, setMatchedMangaList] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<any>();
  /* Pagination */
  const itemsPerPage = 5;
  const totalPages = Math.ceil(matchedMangaList.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const lastMangaIndex = currentPage * itemsPerPage;
  const firstMangaIndex = lastMangaIndex - itemsPerPage;
  const paginatedData = matchedMangaList.slice(firstMangaIndex, lastMangaIndex);

  /* 
  Select a manga to be added into db
  */
  const handleOnClickSelectTitle = (title: any) => {
    setSelectedTitle(title);
  };

  useEffect(() => {
    console.log("selectedTitle", selectedTitle);
  }, [selectedTitle]);

  useEffect(() => {
    const fetching = async () => {
      const data = await searchMangaDex(query);
      setResults(data);
    };
    fetching();
  }, [query]);

  const handleOnClickSearch = async () => {
    if (query === "") {
      window.alert("Please enter something in the searchbar.");
    }
    if (results && results.length > 0) {
      setCurrentPage(1)
      const baseUrl = "mangadex.org/title";
      setMatchedMangaList([]);
      results.map(async (res: any, key: any) => {
        const coverArt = await getCoverImageMangadex(res);
        setMatchedMangaList((prev: any) => {
          const mangaTitle = {
            url: `${res.id}`,
            data: res,
            cover: coverArt,
          };
          return [...prev, mangaTitle];
        });
      });
    }
  };
  // useEffect(() => {
  //   if (results && results.length > 0) {
  //     const baseUrl = "mangadex.org/title";
  //     results.map((res: any) => {
  //       setMatchedMangaList((prev: any) => {
  //         const mangaTitle = {
  //           url: `${baseUrl}/${res.id}`, // Assuming `res.id` is the unique identifier
  //           data: res, // Includes the full `res` object
  //         };
  //         return { ...prev, mangaTitle };
  //       });
  //     });
  //   }
  // }, [results]);

  useEffect(() => {
    console.log("matched titles", matchedMangaList);
  }, [matchedMangaList]);
  return (
    <div className="flex flex-col items-center justify-center mb-5">
      <h1 className="text-xl my-5 bg-red-400 rounded-md shadow-md flex items-center p-3 justify-center font-semibold w-full">
        Add a New Title (MangaDex API)
      </h1>

      <p className="text-gray-600 text-sm text-center max-w-md italic mb-5">
        Enter the manga title below, and we will search for matching titles.
        Select one from the results to add it to our database.
      </p>

      <div className="flex items-center justify-center space-x-2 h-fit w-fit mb-5">
        <Input
          className=" w-[20vw]"
          placeholder="Enter manga title..."
          id="query"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="border text-xs hover:scale-105 ease-in-out duration-200 transition-all p-2 rounded-sm bg-orange-500 font-semibold"
          onClick={() => handleOnClickSearch()}
        >
          Search
        </button>
      </div>
      {matchedMangaList.length > 0 && (
        <table className="w-full border-collapse ">
          <thead>
            <tr className="text-left ">
              <th className="" style={{ width: "20%" }}>
                Name
              </th>
              <th style={{ width: "15%" }}>Cover</th>
              <th style={{ width: "10%" }}>Status</th>
              <th style={{ width: "5%" }}>Link</th>
              <th style={{ width: "15%" }}></th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {paginatedData.map((manga: any, index: any) => (
              <tr key={index} className="border-t ">
                <td className=" py-3">
                  {Object.values(manga.data.attributes.title)}
                </td>
                <td className=" py-3 text-left">
                  <img
                    src={manga.cover}
                    className="w-24 h-24 object-cover rounded-md shadow-md"
                    alt="Cover"
                  />
                </td>
                <td
                  className={`py-3 text-left ${manga.data.attributes.status === "ongoing" ? "text-green-400" : "text-orange-300"}`}
                >
                  {manga.data.attributes.status}
                </td>
                <td className=" py-3 text-left">
                  <a
                    href={`https://mangadex.org/title/${manga.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-orange-400 hover:underline transition-all duration-200"
                  >
                    Open
                  </a>
                </td>
                <td className="text-center text-lg">
                  <button
                    className="text-purple-300 font-semibold hover:text-xl duration-200 ease-in-out transition-all"
                    onClick={() => handleOnClickSelectTitle(manga)}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {matchedMangaList.length > 0 && (
        <div className="flex space-x-5 items-center mt-10">
          <button
            className={`bg-gray-400 border p-2 rounded-sm text-xs ${currentPage === 1 ? "cursor-not-allowed" : ""}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <p>
            Page {currentPage} of{" "}
            <span className="text-xl font-semibold text-orange-500">
              {totalPages}
            </span>
          </p>
          <button
            className={`bg-green-400 border p-2 rounded-sm text-xs ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
export default CreateMangaModalAPI;

async function getCoverImageMangadex(data: any) {
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
}
