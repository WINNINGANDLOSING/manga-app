"use client";
import Flag from "react-world-flags";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { CLOUDINARY_CLOUD_NAME } from "@/lib/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSection,
  faSquareCaretLeft,
  faSquareCaretRight,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

import {
  getAllTags,
  getAllCreators,
  addNewManga,
  getAllManga,
  searchMangaDex,
  getCoverImageMangaDex,
  getCreatorsMangaDex,
} from "@/lib/actions";
import { useFormStatus } from "react-dom";

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

interface alternateTiles {
  flag: string;
  content: string;
}
/* 
 🇯🇵 Japanese
            </option>
            <option value="🇰🇷" className="bg-gray-800 text-white">
              🇰🇷 Korean
            </option>
            <option value="🇹🇭" className="bg-gray-800 text-white">
              🇹🇭 Thailand
            </option>
            <option value="🇬🇧" className="bg-gray-800 text-white">
              🇬🇧 English
            </option>
            <option value="🇨🇳" className="bg-gray-800 text-white">
              🇨🇳 Chinese
            </option>
            <option value="🇫🇷" className="bg-gray-800 text-white">
              🇫🇷 French
            </option>
            <option value="🇪🇸" className="bg-gray-800 text-white">
              🇪🇸 Spanish
            </option>
            <option value="🇩🇪" className="bg-gray-800 text-white">
              🇩🇪 German
            </option>
            <option value="🇮🇹" className="bg-gray-800 text-white">
              🇮🇹 Italian
            </option>
            <option value="🇧🇷" className="bg-gray-800 text-white">
              🇧🇷 Portuguese
            </option>
            <option value="Russian" className="bg-gray-800 text-white">
              🇷🇺 Russian
*/
const lanMappings: Record<string, string> = {
  ja: "🇯🇵 Japanese",
  id: "🇮🇩 Indonesian",
  zh: "🇨🇳 Chinese (Simplified)",
  "zh-hk": "🇭🇰 Chinese (Hong Kong)",
  "zh-ro": "🇨🇳 Chinese (Romanized)",
  en: "🇬🇧 English",
  pt: "🇵🇹 Portuguese",
  "pt-br": "🇧🇷 Portuguese (Brazil)",
  es: "🇪🇸 Spanish",
  "es-la": "🇪🇸 Spanish (Latin America)",
  ko: "🇰🇷 Korean",
  "ko-ro": "🇰🇷 Korean (Romanized)",
  vi: "🇻🇳 Vietnamese",
  fr: "🇫🇷 French",
  de: "🇩🇪 German",
  ru: "🇷🇺 Russian",
  th: "🇹🇭 Thai",
  ka: "🇬🇪 Georgian",
  pl: "🇵🇱 Polish",
  "ja-ro": "🇯🇵 Japanese (Romanized)",
};


const CreateMangaModalAPI = () => {
  /*
  Page 1: Searching for the desired title to add
  Part 2: Confirm and hit okay to add said title
    Part 2 should be divided into multiple parts
   */
  const [stage, setStage] = useState(1);
  const [subStage, setSubStage] = useState(2);
  const [queryLoading, setQueryLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  // =====================================================================================
  // Part 1
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
  const handleOnClickSelectTitle = (manga: any) => {
    console.log(manga);
    // const transformedAtlTitles = manga.data.attributes.altTitles.map(
    //   (obj: any) => {
    //     const key = Object.keys(obj)[0];
    //     return {
    //       flag: key,
    //       content: obj[key || ""],
    //     };
    //   }
    // );

    const tranformedAltTitles = manga.data.attributes.altTitles.map(
      (altTitle: any) => {
        return {
          flag: lanMappings[Object.keys(altTitle)[0] as string],
          content: Object.values(altTitle)[0],
        };
      }
    );
    const rawTitle = Object.values(manga.data.attributes.title)[0] as string;
    try {
      setLoading(true);
      setStage(2);
      setTitle(rawTitle);
      setAltTitles(tranformedAltTitles);
      setCoverImage(manga.cover);
      setSynopsis(manga.data.attributes.description.en);
      setAut(manga.authors);
      setArt(manga.artists);
      setContentRating(manga.data.attributes.contentRating);
      setReleaseYear(manga.data.attributes.year);
      setStatus(manga.data.attributes.status);
      setOriginLan(manga.data.attributes.originalLanguage);
      setTags(
        manga.data.attributes.tags.map((tag: any) => tag.attributes.name.en)
      );
    } catch (err) {
      console.log("Failed to grab data.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetching = async () => {
  //     try {
  //       if (query !== "") {
  //         setMatchedMangaList([]);
  //         setQueryLoading(true);

  //         const data = await searchMangaDex(query);
  //         data.map(async (res: any, key: any) => {
  //           const coverArt = await getCoverImageMangadex(res);
  //           setMatchedMangaList((prev: any) => {
  //             const mangaTitle = {
  //               url: `${res.id}`,
  //               data: res,
  //               cover: coverArt,
  //             };
  //             return [...prev, mangaTitle];
  //           });
  //         });

  //         //setResults(data);
  //       }
  //     } catch (err) {
  //       console.log("failed");
  //     } finally {
  //       setQueryLoading(false);
  //     }
  //   };
  //   fetching();
  // }, [query]);
  // useEffect(() => {
  //   console.log("selectedTitle", selectedTitle);
  // }, [selectedTitle]);

  // useEffect(() => {
  //   console.log("res", results);
  // }, [results]);
  // useEffect(() => {
  //   console.log("query", query);
  // }, [query]);

  const searchForResults = async () => {
    setMatchedMangaList([]);
    setQueryLoading(true);

    const data = await searchMangaDex(query);
    console.log("data", data);
    data.map(async (res: any, key: any) => {
      const coverArt = await getCoverImageMangaDex(res);
      const { authorNames, artistNames } = await getCreatorsMangaDex(res);

      setMatchedMangaList((prev: any) => {
        const mangaTitle = {
          url: `${res.id}`,
          data: res,
          cover: coverArt,
          authors: authorNames,
          artists: artistNames,
        };
        return [...prev, mangaTitle];
      });
    });
  };
  const handleOnClickSearch = async () => {
    if (query === "") {
      window.alert("Please enter something in the searchbar.");
      return;
    }
    await searchForResults();
    setQueryLoading(false);

    // if (!queryLoading) {
    //   results.map(async (res: any, key: any) => {
    //     const coverArt = await getCoverImageMangadex(res);
    //     setMatchedMangaList((prev: any) => {
    //       const mangaTitle = {
    //         url: `${res.id}`,
    //         data: res,
    //         cover: coverArt,
    //       };
    //       return [...prev, mangaTitle];
    //     });
    //   });
    // }
  };

  // =====================================================================================
  // Part 2
  const [title, setTitle] = useState<string>("");
  useEffect(() => {
    console.log("title api", title);
    console.log("type of", typeof title);
  }, [title]);
  const [altTitles, setAltTitles] = useState([]);
  useEffect(() => {
    console.log("alt", altTitles);
  }, [altTitles]);
  const [coverImage, setCoverImage] = useState(null);
  useEffect(() => {
    console.log("image", coverImage);
    if (coverImage !== null) {
      urlToFile(coverImage, "img.jpg", "image/jpeg").then((file) =>
        console.log(file)
      );
    }
  }, [coverImage]);

  const [synopsis, setSynopsis] = useState("");
  const [authors, setAut] = useState([]);
  const [artists, setArt] = useState([]);
  const [originalLan, setOriginLan] = useState("Japanese");
  const [contentRating, setContentRating] = useState("Safe");
  const [releaseYear, setReleaseYear] = useState(2020);
  const [status, setStatus] = useState("ongoing");
  const [tags, setTags] = useState<string[]>([]);

  // =======================================================================================
  // Adding Manga to Database
  const [allMangas, setAllMangas] = useState<Manga[] | null>(null);
  const [lastManga, setLastManga] = useState<number>(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchingManga = async () => {
      const data = await getAllManga();
      setAllMangas(data);
    };
    fetchingManga();
  }, []);
  useEffect(() => {
    if (allMangas && allMangas !== null) {
      const last = 10000 + allMangas.length;
      setLastManga(last);
    }
  }, [allMangas]);

  // Adding cover image
  const handleAddingCoverImage = async (image: any) => {
    try {
      const imageToObject = await urlToFile(image, "img.jpg", "image/jpeg");
      const formData = new FormData();
      formData.append("file", imageToObject);
      formData.append("upload_preset", "ml_default");
      const folderName = `${lastManga + 1}/bg_cover`;
      formData.append("folder", folderName);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      const uploadedImageUrl = response.data.secure_url;
      console.log("Image uploaded successfully:", uploadedImageUrl);
      return uploadedImageUrl;
    } catch (err) {
      console.log("ERROR UPLOADING IMAGE TO CLOUDINARY");
      return "BLANK";
    }
  };

  // Adding Manga Main function Helper Function
  const handleAddingNewMangaHelper = async (
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
    try {
      const response = await addNewManga(
        title,
        alternative_titles,
        description,
        authors,
        artists,
        originalLanguage,
        releaseYear,
        content_rating,
        tags,
        cover_image_url
      );
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddingNewManga = async () => {
    try {
      setSubmitLoading(true);

      /* 
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
            */
      const bg_url = await handleAddingCoverImage(coverImage);
      await handleAddingNewMangaHelper(
        title,
        altTitles,
        synopsis,
        authors,
        artists,
        originalLan,
        releaseYear,
        contentRating,
        tags,
        bg_url
      );
      setSubmitLoading(false);

      alert("Images uploaded and chapter created successfully!");
      window.location.reload();
    } catch (err) {
      console.log("ERROR");
    } finally {
      setUploading(false);
    }
  };
  return (
    <form>
      {stage === 1 && (
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="flex-col text-xl my-5 bg-red-400 rounded-md shadow-md flex items-center p-3 justify-center font-semibold w-full">
            <p>Add a New Title (MangaDex API)</p>
            <p className="text-base">(Part 1: Searching for titles)</p>
          </div>
          <p className="text-gray-600 text-sm text-center max-w-md italic mb-5">
            Enter the manga title below, and we will search for matching titles.
            Select one from the results to add it to our database.
          </p>
          <div className="flex justify-center items-center  mb-20 space-x-2">
            <Input
              className=" w-[25vw] "
              placeholder="Enter manga title..."
              id="query"
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="button"
              className="bg-orange-600 font-semibold px-2 w-16 h-8 text-xs rounded-sm"
              onClick={() => handleOnClickSearch()}
            >
              Search
            </button>
          </div>
          {/* <button
              type="button"
              className="border text-xs hover:scale-105 ease-in-out duration-200 transition-all p-2 rounded-sm bg-orange-500 font-semibold"
              onClick={async () => await handleOnClickSearch()}
            >
              Search
            </button> */}

          {queryLoading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="w-full px-20">
              {matchedMangaList.length > 0 && (
                <table className="w-full  border-l-[1px] border-r-[1px]  border-b-[1px]  ">
                  <thead className="">
                    <tr className="text-left boder-t-2 border p-2">
                      <th className="px-2" style={{ width: "20%" }}>
                        Name
                      </th>
                      <th style={{ width: "15%" }}>Cover</th>
                      <th style={{ width: "10%" }}>Status</th>
                      <th style={{ width: "5%" }}>Link</th>
                      <th style={{ width: "15%" }}></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm ">
                    {paginatedData.map((manga: any, index: any) => (
                      <tr key={index} className="border-t  ">
                        <td className="px-2 py-3">
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
                            type="button"
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
            </div>
          )}

          {matchedMangaList.length > 0 && (
            <div className="flex space-x-5 items-center mt-10">
              <button
                type="button"
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
                type="button"
                className={`bg-green-400 border p-2 rounded-sm text-xs ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        stage === 2 && (
          <div className="flex flex-col  mb-5">
            <div className="flex-col text-xl my-5 bg-red-400 rounded-md shadow-md flex items-center p-3 justify-center font-semibold w-full">
              <p>Add a New Title (MangaDex API)</p>
              <p className="text-base">(Part 2: Confirm and Adding)</p>
            </div>

            <div className="flex flex-col space-y-5 mb-5">
              {/* Main Title */}
              <div>
                <h1 className="font-semibold">
                  Title: <span className="text-lg">{Object.values(title)}</span>
                </h1>
              </div>

              <div className="flex ">
                {/* Cover Image Section */}
                <div className="space-y-2 border-r-2" style={{ width: "20%" }}>
                  <h1 className="font-semibold">Cover Image</h1>
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="Selected Cover"
                      className="w-[10vw] h-[25vh] border rounded"
                    />
                  )}
                </div>

                {/* Metadata Section */}
                <div className="space-y-2 pl-10">
                  <h1 className="font-semibold">
                    Content Rating:{" "}
                    <span className="text-lg">{contentRating}</span>
                  </h1>
                  <h1 className="font-semibold">
                    Release Year: <span className="text-lg">{releaseYear}</span>
                  </h1>
                  <h1 className="font-semibold">
                    Status: <span className="text-lg">{status}</span>
                  </h1>
                  <h1 className="font-semibold ">
                    Original Language:&nbsp;
                    <span className="text-lg">
                      {lanMappings[originalLan] || originalLan}
                    </span>
                  </h1>

                  {/* Authors & Artists */}
                  <div className="flex flex-wrap items-center space-x-5">
                    <h1 className="font-semibold space-x-2 flex items-center">
                      <p>Authors:</p>
                      <div className="flex space-x-2 text-xs">
                        {authors.map((aut: any, ind: any) => (
                          <div
                            className="bg-gray-300 px-2 rounded-sm text-black"
                            key={ind}
                          >
                            {aut}
                          </div>
                        ))}
                      </div>
                    </h1>
                    <FontAwesomeIcon icon={faSection} size="lg" />
                    <h1 className="font-semibold space-x-2 flex items-center">
                      <p>Artists:</p>
                      <div className="flex space-x-2 text-xs">
                        {artists.map((aut: any, ind: any) => (
                          <div
                            className="bg-gray-300 px-2 rounded-sm text-black"
                            key={ind}
                          >
                            {aut}
                          </div>
                        ))}
                      </div>
                    </h1>
                  </div>
                </div>
              </div>

              {/* Alternative Titles */}
              <div className="space-y-2">
                <h1 className="font-semibold">Alternative Titles:</h1>
                <div className="space-y-3">
                  {altTitles.map((title: any, index: any) => (
                    <div
                      key={index}
                      className="border rounded-sm p-3 flex space-x-3"
                    >
                      <p>
                        {title.flag} | {title.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <h1 className="font-semibold">Synopsis</h1>
                <p className="border-[1px] p-2 mt-3 rounded-sm text-sm whitespace-pre-line">
                  {synopsis}
                </p>
              </div>

              {/* Tags (at the bottom for easy scanning) */}
              <div className="space-y-2">
                <h1 className="font-semibold">Tags:</h1>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: any, index: any) => (
                    <div
                      key={index}
                      className="rounded-sm bg-gray-400 px-2 py-1 text-xs"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      )}
      {stage === 2 && (
        <button
          type="submit"
          disabled={submitLoading}
          className={`bg-green-400 flex ml-auto transition-all text-sm ease-in-out duration-200 rounded-md p-2 hover:scale-110 ${submitLoading ? "cursor-not-allowed" : ""}`}
          onClick={async () => await handleAddingNewManga()}
        >
          {/* {pending ? "Submitting" : "Done"} */}
          {submitLoading ? "Uploading..." : "Upload New Manga"}
        </button>
      )}
    </form>
    /* <div className="mt-auto self-end space-x-2">
              <button
                disabled={subStage === 1}
                onClick={() => setSubStage(subStage - 1)}
              >
                <FontAwesomeIcon
                  icon={faSquareCaretLeft}
                  style={{ color: "#ff6600" }}
                  size="xl"
                  className={`hover:cursor-pointer hover:scale-110 ${subStage === 1 ? "hover:cursor-not-allowed" : ""}`}
                />
              </button>
              <button disabled={subStage === 3}>
                <FontAwesomeIcon
                  icon={faSquareCaretRight}
                  size="xl"
                  style={{ color: "#63E6BE" }}
                  onClick={() => setSubStage(subStage + 1)}
                  className={`hover:cursor-pointer hover:scale-110 ${subStage === 3 ? "hover:cursor-not-allowed" : ""}`}
                />
              </button>
            </div> */
  );
};
export default CreateMangaModalAPI;

// export async function getCreatorsMangaDex1(data: any) {
//   try {
//     const authorList = data.relationships.filter(
//       (rel: any) => rel.type === "author"
//     );
//     const artistList = data.relationships.filter(
//       (rel: any) => rel.type === "artist"
//     );

//     //const mangaId = data.id;

//     const authorPromises = authorList.map((author: any) =>
//       axios.get(`https://api.mangadex.org/author/${author.id}`)
//     );
//     const artistPromises = artistList.map((artist: any) =>
//       axios.get(`https://api.mangadex.org/author/${artist.id}`)
//     );
//     const authorResponses = await Promise.all(authorPromises);
//     const artistResponses = await Promise.all(artistPromises);
//     console.log("res");
//     authorResponses.map((res: any) => {
//       console.log("res", res.data.data.attributes.name);
//     });
//     const authorNames = authorResponses.map(
//       (res) => res.data.data.attributes.name
//     );
//     console.log("authorNames", authorNames);

//     const artistNames = artistResponses.map(
//       (res) => res.data.data.attributes.name
//     );
//     return {
//       authorNames,
//       artistNames,
//     };
//   } catch (err) {
//     console.error("Error fetching creators:", err);
//     return { authorName: null, artistName: null }; // Return a fallback object
//   }
// }

async function urlToFile(url: string, filename: string, mimeType: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
}
