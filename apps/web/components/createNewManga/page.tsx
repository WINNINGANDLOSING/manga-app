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

import { getAllTags, getAllCreators } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import CreateNewSynopsisModal from "./CreateNewSynopsisModal";
import CreateNewAlternativeTitlesModal from "./CreateNewAlternativeTitles";
import CreateNewAuthors from "./CreateNewAuthors";
const CreateMangaModal = () => {
  // const { pending } = useFormStatus();

  // Linh Tinh
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagsByContentRating, setTagsByContentRating] = useState<string[]>([]);
  const [tagsByOrigin, setTagsByOrigin] = useState<string[]>([]);
  const [tagsByFormat, setTagsByFormat] = useState<string[]>([]);
  const [tagsByGenres, setTagsByGenres] = useState<string[]>([]);
  const [tagsByThemes, setTagsByThemes] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 4;
  const [errorList, setErrorList] = useState<string[]>([]);

  useEffect(() => {
    console.log("error list");
    console.log(errorList);
  }, [errorList]);
  const handleSetCurrentPage = (operator: string) => {
    // Set list of errors
    const updateErrorList = (field: string, errorMessage: string | null) => {
      setErrorList((prevState) => {
        const updatedState = { ...prevState };
        if (errorMessage) {
          updatedState[
            field === "title"
              ? 0
              : field === "CoverImage"
                ? 1
                : field === "synopsis"
                  ? 2
                  : field === "authors"
                    ? 3
                    : field === "artists"
                      ? 4
                      : field === "content-rating"
                        ? 5
                        : field === "original-language"
                          ? 6
                          : field === "selected-content-rating"
                            ? 7
                            : field === "selected-origin"
                              ? 8
                              : field === "selected-formats"
                                ? 9
                                : field === "selected-genres"
                                  ? 10
                                  : 11
          ] = errorMessage;
        } else {
          delete updatedState[
            field === "title"
              ? 0
              : field === "CoverImage"
                ? 1
                : field === "synopsis"
                  ? 2
                  : field === "authors"
                    ? 3
                    : field === "artists"
                      ? 4
                      : field === "content-rating"
                        ? 5
                        : field === "original-language"
                          ? 6
                          : field === "selected-content-rating"
                            ? 7
                            : field === "selected-origin"
                              ? 8
                              : field === "selected-formats"
                                ? 9
                                : field === "selected-genres"
                                  ? 10
                                  : 11
          ];
        }
        return updatedState;
      });
    };

    const validatePageOne = () => {
      updateErrorList("title", title === "" ? "Missing field: Title" : null);
      updateErrorList(
        "CoverImage",
        coverImage === null ? "Missing Field: Cover Image" : null
      );
      updateErrorList(
        "synopsis",
        synopsis === null ? "Missing Field: Synopsis" : null
      );
    };

    const validatePageTwo = () => {
      updateErrorList(
        "authors",
        selectedAuthors.length === 0 ? "Missing field: Authors" : null
      );
      updateErrorList(
        "artists",
        selectedArtists.length === 0 ? "Missing Field: Artists" : null
      );
      updateErrorList(
        "content-rating",
        contentRating === "DEFAULT" ? "Missing Field: Content Rating" : null
      );
      updateErrorList(
        "original-language",
        originalLan === "DEFAULT" ? "Missing Field: Original Language" : null
      );
      updateErrorList(
        "release-year",
        releaseYear === 0 || !releaseYear ? "Missing Field: Release Year" : null
      );
    };

    const validatePageThree = () => {
      updateErrorList(
        "selected-content-rating",
        selectedContentRating === ""
          ? "You have not chosen any tag belong to Category 'Content Rating'"
          : null
      );
      updateErrorList(
        "selected-origin",
        selectedOrigin === ""
          ? "You have not chosen any tag belong to Category 'Origin'"
          : null
      );
      updateErrorList(
        "selected-formats",
        selectedFormats.length === 0
          ? "Please choose at least one tag belong to Category 'Format'"
          : null
      );

      updateErrorList(
        "selected-genres",
        selectedGenres.length === 0
          ? "Please choose at least one tag belong to Category 'Genre'"
          : null
      );

      updateErrorList(
        "selected-themes",
        selectedThemes.length === 0
          ? "Please choose at least one tag belong to Category 'Theme'"
          : null
      );
    };

    if (currentPage === 1) {
      validatePageOne();
    } else if (currentPage === 2) {
      validatePageTwo();
    } else {
      validatePageThree();
    }

    // Actual conditions (reqs) checking
    const isValidPageOne =
      title &&
      title !== "" &&
      coverImage &&
      coverImage !== null &&
      synopsis &&
      synopsis !== null;
    const isValidPageTwo =
      selectedAuthors.length > 0 &&
      selectedArtists.length > 0 &&
      contentRating !== "" &&
      originalLan !== "" &&
      releaseYear;

    const isValidPageThree =
      selectedContentRating !== "" &&
      selectedOrigin !== "" &&
      selectedFormats.length > 0 &&
      selectedGenres.length > 0 &&
      selectedThemes.length > 0;

    if (operator === "+") {
      const conditionsChecking =
        currentPage === 1
          ? isValidPageOne
          : currentPage === 2
            ? isValidPageTwo
            : currentPage === 3
              ? isValidPageThree
              : false;
      if (conditionsChecking) {
        //setCurrentPage(Math.min(currentPage + 1, 4)); // Ensure that the currentPage does not exceed 4
      }
    } else {
      setErrorList([]);
      setCurrentPage(Math.max(currentPage - 1, 1)); // Ensure that the currentPage does not go below 1
    }
  };

  // Fetching Tags
  useEffect(() => {
    const fetchingTags = async () => {
      try {
        const tagsData = await getAllTags();
        setAllTags(tagsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchingTags();
  }, []);

  // Divide tags by their categories
  useEffect(() => {
    if (allTags && allTags !== null) {
      if (allTags && allTags !== null) {
        // Filter and set tags by their respective types
        setTagsByContentRating(
          allTags
            .filter((tag: any) => tag.tag_type === "content-rating")
            .map((tag: any) => tag.name)
        );
        setTagsByOrigin(
          allTags
            .filter((tag: any) => tag.tag_type === "origin")
            .map((tag: any) => tag.name)
        );
        setTagsByFormat(
          allTags
            .filter((tag: any) => tag.tag_type === "format")
            .map((tag: any) => tag.name)
        );
        setTagsByGenres(
          allTags
            .filter((tag: any) => tag.tag_type === "genres")
            .map((tag: any) => tag.name)
        );
        setTagsByThemes(
          allTags
            .filter((tag: any) => tag.tag_type === "themes")
            .map((tag: any) => tag.name)
        );
      }
    }
  }, [allTags]);

  // Form Inputs Data (prequisites)
  const [fetchedDataCreators, setFetchedDataCreators] = useState<any[]>([]);

  const [searchQueryAu, setSearchQueryAu] = useState<string>("");
  const [searchQueryAr, setSearchQueryAr] = useState<string>("");

  const [isFocusedAu, setIsFocusedAu] = useState(false);
  const [isFocusedAr, setIsFocusedAr] = useState(false);

  const inputRefAu = useRef(null);
  const inputRefAR = useRef(null);

  // const dropdownRefAu = useRef(null);
  // const dropdownRefAR = useRef(null);

  const handleFocus = (queryType: string) => {
    if (queryType === "Au") {
      setIsFocusedAu(true);
    } else {
      setIsFocusedAr(true);
    }
  };

  const handleBlur = (queryType: string) => {
    if (queryType === "Au") {
      setIsFocusedAu(false);
    } else {
      setIsFocusedAr(false);
    }
  };

  const handleOnClickAddAuthors = (queryType: string, selectedItem: any) => {
    console.log("Selected item:", selectedItem); // Log the selected author object
    if (selectedItem.id === "add-author") {
      setIsOpenAddAuthors(true);
      return;
    }
    if (queryType === "Au") {
      setSearchQueryAu("");
      setSelectedAuthors((prevState) => {
        if (!prevState.some((data) => data === selectedItem)) {
          return [...prevState, selectedItem];
        }
        return prevState;
      });
    } else {
      setSelectedArtists((prevState) => {
        setSearchQueryAr("");
        if (!prevState.some((data) => data === selectedItem)) {
          return [...prevState, selectedItem];
        }

        return prevState;
      });
    }
  };

  useEffect(() => {
    const fetchingCreator = async () => {
      const data = await getAllCreators();
      const sortedData = data.sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );
      setFetchedDataCreators(sortedData);
    };
    fetchingCreator();
  }, []);

  const filteredAuthors = [
    ...fetchedDataCreators.filter((creator) =>
      creator.name.toLowerCase().startsWith(searchQueryAu.toLowerCase())
    ),
    { name: "Add Author +", id: "add-author" }, // Adding the 'Add Author +' option at the end
  ];

  const filteredArtists = [
    ...fetchedDataCreators.filter((creator) =>
      creator.name.toLowerCase().startsWith(searchQueryAr.toLowerCase())
    ),
    { name: "Add Artist +", id: "add-artist" },
  ];

  // Actual Form Data
  // Page 1
  const [title, setTitle] = useState<string>("");

  const [alternateTitles, setAlternateTitles] = useState<string[]>([]);

  const [isOpenModalTitles, setIsOpenModalTitles] = useState(false);

  const [coverImage, setCoverImage] = useState(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    setCoverImage(file);
  };

  const handleImageRemove = () => {
    setCoverImage(null);
  };

  const [synopsis, setSynopsis] = useState(null);
  const [synopsisError, setSynopsisError] = useState(false);

  const [isOpenModalSynopsis, setIsOpenModalSynopsis] = useState(false);
  const handleSetModal = () => {
    setIsOpenModalTitles(true);
  };
  const handleOnClose = (type: string) => {
    if (type === "altT") {
      setIsOpenModalTitles(false);
    } else if (type === "synopsis") {
      setIsOpenModalSynopsis(false);
    } else if (type === "add-author") {
      setIsOpenAddAuthors(false);
    } else {
      setIsOpenAddArtists(false);
    }
  };

  // Page 2
  const [selectedAuthors, setSelectedAuthors] = useState<any[]>([]);
  const [newAuthors, setNewAuthors] = useState<any[]>([]); // used to add new authors if the list does not have

  const [selectedArtists, setSelectedArtists] = useState<any[]>([]);

  const [newArtists, setNewArtists] = useState<any[]>([]); // used to add new artists if the list does not have

  useEffect(() => {
    newAuthors.map((author) => {
      handleOnClickAddAuthors("Au", author);
    });
    newArtists.map((artist) => {
      handleOnClickAddAuthors("Ar", artist);
    });
  }, [newAuthors, newArtists]);
  const [isOpenAddAuthors, setIsOpenAddAuthors] = useState(false);
  const [isOpenAddArtists, setIsOpenAddArtists] = useState(false);

  const [contentRating, setContentRating] = useState("DEFAULT");
  // useEffect(() => {
  //   console.log("content rating", contentRating);
  // }, [contentRating]);
  const [originalLan, setOriginalLan] = useState("DEFAULT");
  // useEffect(() => {
  //   console.log("originalLan", originalLan);
  // }, [originalLan]);
  const [releaseYear, setReleaseYear] = useState<number>(2020);
  // useEffect(() => {
  //   console.log("releaseYear", releaseYear);
  // }, [releaseYear]);
  // useEffect(() => {
  //   console.log("selected authors");
  //   console.log(selectedAuthors);
  // }, [selectedAuthors]);

  // Page 4
  const [selectedContentRating, setSelectedContentRating] = useState("");
  const handleSetSelectedCR = (tag: string) => {
    setSelectedContentRating(selectedContentRating === tag ? "" : tag);
  };

  const [selectedOrigin, setSelectedOrigin] = useState("");
  const handleSetSelectedOrigin = (tag: string) => {
    setSelectedOrigin(selectedOrigin === tag ? "" : tag);
  };

  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const handleSetSelectedFormat = (type: number, tag: string) => {
    if (type === 0) {
      setSelectedFormats((prevState: any) => {
        if (prevState.some((existingTag: string) => existingTag === tag)) {
          return prevState.filter((existingTag: string) => existingTag !== tag);
        } else {
          return [...prevState, tag];
        }
      });
    } else if (type === 1) {
      setSelectedGenres((prevState: any) => {
        if (prevState.some((existingTag: string) => existingTag === tag)) {
          return prevState.filter((existingTag: string) => existingTag !== tag);
        } else {
          return [...prevState, tag];
        }
      });
    } else {
      setSelectedThemes((prevState: any) => {
        if (prevState.some((existingTag: string) => existingTag === tag)) {
          return prevState.filter((existingTag: string) => existingTag !== tag);
        } else {
          return [...prevState, tag];
        }
      });
    }
  };
  return (
    <form>
      {/* Page 1 */}
      {currentPage == 1 && (
        <div className="">
          <h1 className="text-xl bg-red-400 rounded-md shadow-md flex items-center p-3 justify-center font-semibold">
            Add New Title (Part 1: Title)
          </h1>
          <div className="flex w-full mt-5 space-x-5">
            <div className="space-y-3 w-1/2">
              <h2 className="font-semibold text-xl">
                Title&nbsp;
                <p className="text-pink-500 inline">(Required)</p>
              </h2>
              <input
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                placeholder="Enter manga's title"
                className="bg-transparent w-full border-[1px] border-white rounded-sm min-h-[4rem] px-3 placeholder:text-xl text-xl overflow-y-hidden"
              />
              <p className="text-sm font-normal text-gray-400 leading-[0.5px]">
                It's recommended to use the{" "}
                <span className="text-red-500">English title</span> for
                consistency, especially for international audiences.
              </p>
            </div>
            <div className="space-y-3 w-1/2">
              <h2 className="font-semibold text-xl">
                Alternative Titles &nbsp;
                <p className="text-green-500 inline">(Optional)</p>
                {alternateTitles.length > 0 && (
                  <button
                    type="button"
                    className="bg-gray-600 text-white text-[0.8rem] px-3 py-1 hover:scale-105 duration-200 ease-in-out transition-all ml-3 rounded-md  hover:outline-none hover:ring-2 hover:ring-gray-500"
                    onClick={() => setAlternateTitles([])}
                  >
                    Undo
                  </button>
                )}
              </h2>

              {alternateTitles.length === 0 && (
                <button
                  type="button"
                  className="min-h-[4rem] border-[1px] space-x-1 rounded-sm border-white bg-gray-800 text-gray-400 flex items-center justify-center  w-full"
                  onClick={handleSetModal}
                >
                  <p className="text-xl">Add alternative titles</p>
                  <p className="text-2xl pb-1">+</p>
                </button>
              )}
              {alternateTitles.length > 0 && (
                <div className="flex flex-col space-y-1">
                  {alternateTitles.map((title: any, index: any) => (
                    <div
                      key={index}
                      className="border-[1px] border-gray-500 p-3 flex items-center justify-center bg-gray-600 rounded-md w-fit text-sm"
                    >
                      Index: #{index}&nbsp; Lan: {title.flag}&nbsp; Content:{" "}
                      {title.content}
                    </div>
                  ))}
                </div>
              )}
              {isOpenModalTitles && (
                <CreateNewAlternativeTitlesModal
                  setAlternativeTitles={setAlternateTitles}
                  onClose={() => handleOnClose("altT")}
                />
              )}
              <p className="text-sm font-normal text-gray-400 leading-[0.5px]">
                Include any alternative titles of this manga in different
                languages (e.g., Japanese, Korean, Chinese).
              </p>
            </div>
          </div>
          <div className="space-y-3 mt-5">
            <h2 className="text-xl font-semibold">
              Cover Image&nbsp;
              <span className="text-pink-500">(Required)</span>
            </h2>
            {coverImage === null && (
              <div className="w-full border-[1px] rounded-sm text-xl flex relative">
                <input
                  id="cover-image"
                  type="file"
                  onChange={handleImageChange}
                  className="opacity-0 absolute inset-0 hover:cursor-pointer left-0 flex items-center justify-center  bg-red-800 text-gray-300 w-full "
                ></input>
                {coverImage === null && (
                  <div className="  flex self-center pl-5 w-full ">
                    <p className="w-2/12 items-center flex">Select File</p>
                    <p className="w-10/12 bg-gray-500 items-center flex pl-3 py-4">
                      No File Chosen
                    </p>
                  </div>
                )}
              </div>
            )}
            {coverImage && coverImage !== null && (
              <div className="mt-5 mb-3  relative h-fit w-fit">
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="Selected Cover"
                  className=" w-[10vw] h-[25vh] border rounded"
                  onLoad={() =>
                    URL.revokeObjectURL(URL.createObjectURL(coverImage))
                  }
                ></img>

                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{ color: "#e70d0d" }}
                  size="lg"
                  onClick={() => handleImageRemove()}
                  className="top-0 right-0 absolute hover:cursor-pointer"
                />
              </div>
            )}
            <p className="text-sm font-normal text-gray-400 leading-[0.5px]">
              Please ensure that any explicit cover images{" "}
              <span className="text-red-500">are censored&nbsp;</span> before
              uploading.
            </p>
          </div>
          <div className="space-y-3 mt-5">
            <h2 className="text-xl font-semibold">
              Synopsis&nbsp;
              <span className="text-pink-500">(Required)</span>
            </h2>
            {!synopsis && (
              <button
                type="button"
                className="border-[1px] min-h-[4rem] border-dashed space-x-1 text-gray-400 items-center justify-center flex w-full rounded-md"
                onClick={() => setIsOpenModalSynopsis(true)}
              >
                <p className="text-xl">Add synopsis</p>
                <p className="text-2xl pb-1">+</p>
              </button>
            )}
            {synopsis && (
              <div>
                Your entered synopsis:{" "}
                <button
                  type="button"
                  className="bg-gray-600 text-white text-[0.8rem] px-3 py-1 hover:scale-105 duration-200 ease-in-out transition-all ml-3 rounded-md   hover:ring-2 hover:ring-gray-500"
                  onClick={() => setSynopsis(null)}
                >
                  Undo
                </button>
                <br />
                <p className="border-[1px] p-2 mt-3 text-sm whitespace-pre-line">
                  {synopsis}
                </p>
              </div>
            )}
            {isOpenModalSynopsis && (
              <CreateNewSynopsisModal
                setSynopsis={setSynopsis}
                onClose={() => handleOnClose("synopsis")}
              />
            )}
            <p className="text-sm font-normal text-gray-400 leading-[0.5px]">
              Provide a brief summary of the plot, characters, and setting of
              the manga. This will help readers get an overview of the story.
            </p>
          </div>
        </div>
      )}

      {/* Page 2 */}
      {currentPage == 2 && (
        <div className="space-y-5">
          <h1 className="text-xl bg-red-400 rounded-md shadow-md flex items-center p-3 justify-center font-semibold">
            Add New Title (Part 2: Metadata)
          </h1>
          <div className="flex w-full space-x-5">
            {/* Authors */}
            <div className="space-y-3 w-1/2">
              <h2 className="font-semibold text-xl">
                Authors&nbsp;
                <p className="text-green-500 inline">(Optional)</p>
              </h2>
              <div className="relative flex bg-transparent w-full border-[1px] pl-3 border-white rounded-sm items-center">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-gray-500 mr-2"
                />
                <input
                  type="text"
                  id="author-search"
                  name="author-search"
                  placeholder="Search authors..."
                  value={searchQueryAu}
                  onChange={(e) => setSearchQueryAu(e.target.value)}
                  className="search-input w-full outline-none p-3 bg-gray-800 text-white"
                  ref={inputRefAu}
                  onFocus={() => handleFocus("Au")}
                  onBlur={() => handleBlur("Au")}
                />
                {/* Custom Dropdown for Authors */}
                <div
                  className={`absolute left-0 right-0 top-full mt-1 bg-gray-800 text-white border-gray-200 rounded-sm shadow-lg z-10 overflow-hidden ${searchQueryAu ? "block" : "hidden"} `}
                >
                  <div className={`max-h-[7vw] overflow-y-auto`}>
                    {filteredAuthors.length === 0 && (
                      <div className="text-gray-500 p-2">No authors found</div>
                    )}
                    {searchQueryAu.length > 0 &&
                      filteredAuthors.map((author, index) => (
                        <div
                          key={index}
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-700 `}
                          onClick={() => handleOnClickAddAuthors("Au", author)}
                        >
                          {author.name}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="text-sm font-normal text-gray-400 space-x-3 leading-[0.5px]">
                {selectedAuthors.length === 0
                  ? "Choose at least one author."
                  : selectedAuthors.map((author: any, index) => (
                      <p
                        key={index}
                        className="inline-flex  px-3 py-2 text-sm bg-gray-600 text-gray-300 rounded-md"
                      >
                        {author.name}
                      </p>
                    ))}
              </div>
              {isOpenAddAuthors && (
                <CreateNewAuthors
                  setAuthorsParent={setNewAuthors}
                  onClose={() => handleOnClose("add-author")}
                />
              )}
            </div>

            {/* Artists */}
            <div className="space-y-3 w-1/2">
              <h2 className="font-semibold text-xl">
                Artists&nbsp;
                <p className="text-green-500 inline">(Optional)</p>
              </h2>
              <div className="relative flex bg-transparent w-full border-[1px] pl-3 border-white rounded-sm items-center">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-gray-500 mr-2"
                />
                <input
                  type="text"
                  id="artist-search"
                  name="artist-search"
                  placeholder="Search artists..."
                  value={searchQueryAr}
                  onChange={(e) => setSearchQueryAr(e.target.value)}
                  className=" w-full outline-none p-3 bg-gray-800 text-white"
                  ref={inputRefAR}
                  onFocus={() => handleFocus("")}
                  onBlur={() => handleBlur("")}
                />
                {/* Custom Dropdown for Authors */}
                <div
                  className={`absolute left-0 right-0 top-full mt-1 bg-gray-800 text-white border-gray-200 rounded-sm shadow-lg z-10 overflow-hidden ${searchQueryAr ? "block" : "hidden"} `}
                >
                  <div className={`max-h-[7vw] overflow-y-auto`}>
                    {filteredArtists.length === 0 && (
                      <div className="text-gray-500 p-2">No artists found</div>
                    )}
                    {filteredArtists.map((artist) => (
                      <div
                        key={artist.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-700 `}
                        onClick={() => handleOnClickAddAuthors("Ar", artist)}
                      >
                        {artist.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-sm font-normal text-gray-400 space-x-3 leading-[0.5px]">
                {selectedArtists.length === 0
                  ? "Choose at least one artist."
                  : selectedArtists.map((artist: any, index: any) => (
                      <p
                        key={index}
                        className="inline-flex  px-3 py-2 text-sm bg-gray-600 text-gray-300 rounded-md"
                      >
                        {artist.name}
                      </p>
                    ))}
              </div>
            </div>
          </div>

          <div className="flex w-full space-x-5">
            <div className="space-y-3 w-1/2">
              <h2 className="font-semibold text-xl flex items-center">
                Content Rating&nbsp;
                <p className="text-pink-500 inline">(Required)</p>
              </h2>

              <select
                id="content-rating"
                name="content-rating"
                value={contentRating} // Bind to the state
                className="add-manga-default-form text-gray-400"
                onChange={(e) => {
                  setContentRating(e.target.value); // Update state when value changes
                  e.target.classList.remove("text-gray-400");
                }}
              >
                <option
                  value="DEFAULT"
                  disabled
                  className="bg-gray-800 text-gray-400"
                >
                  Select Content Rating
                </option>
                <option value="Safe" className="bg-gray-800 text-white">
                  Safe
                </option>
                <option value="Suggestive" className="bg-gray-800 text-white">
                  Suggestive
                </option>
                <option value="Ecchi" className="bg-gray-800 text-white">
                  Ecchi
                </option>
                <option value="Porno" className="bg-gray-800 text-white">
                  Pornographic
                </option>
              </select>
              <p className="text-sm font-normal text-gray-400 leading-[0.5px]">
                Can be either Safe, Suggestive, Ecchi or Pornographic.
              </p>
            </div>
            <div className="space-y-3 w-1/2">
              <h2 className="font-semibold text-xl flex items-center">
                Original Language&nbsp;
                <p className="text-pink-500 inline">(Required)</p>
              </h2>

              <select
                id="original-language"
                name="original-language"
                required
                value={originalLan} // Bind to the state
                className="add-manga-default-form text-gray-400"
                onChange={(e) => {
                  setOriginalLan(e.target.value); // Update state when value changes
                  e.target.classList.remove("text-gray-400");
                }}
              >
                <option
                  value="DEFAULT"
                  disabled
                  className="bg-gray-800 text-gray-400"
                >
                  Select Original Language
                </option>
                <option value="Japanese" className="bg-gray-800 text-white">
                  🇯🇵 Japanese
                </option>
                <option value="Korean" className="bg-gray-800 text-white">
                  🇰🇷 Korean
                </option>
                <option value="Thailand" className="bg-gray-800 text-white">
                  🇹🇭 Thailand
                </option>
                <option value="English" className="bg-gray-800 text-white">
                  🇺🇸 English
                </option>
                <option value="Chinese" className="bg-gray-800 text-white">
                  🇨🇳 Chinese
                </option>
                <option value="French" className="bg-gray-800 text-white">
                  🇫🇷 French
                </option>
                <option value="Spanish" className="bg-gray-800 text-white">
                  🇪🇸 Spanish
                </option>
                <option value="German" className="bg-gray-800 text-white">
                  🇩🇪 German
                </option>
                <option value="Italian" className="bg-gray-800 text-white">
                  🇮🇹 Italian
                </option>
                <option value="Portuguese" className="bg-gray-800 text-white">
                  🇧🇷 Portuguese
                </option>
                <option value="Russian" className="bg-gray-800 text-white">
                  🇷🇺 Russian
                </option>
              </select>
              <p className="text-sm font-normal text-gray-400 leading-[0.5px]">
                Select the language that the manga was originally written in.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-semibold text-xl">
              Year&nbsp;
              <p className="text-pink-500 inline">(Required)</p>
            </h2>
            <input
              type="number"
              min="1600"
              max="2025"
              step="1"
              defaultValue={2020}
              id="year"
              name="year"
              className="add-manga-default-form w-full"
              onChange={(e) => setReleaseYear(Number(e.target.value))}
            />
            <p className="text-sm font-normal text-gray-400 leading-[0.5px]">
              Year when the manga was first released.
            </p>
          </div>
        </div>
      )}

      {/* Page 3 */}
      {/* Page 3 */}
      {currentPage == 3 && (
        <div className="space-y-5">
          <h1 className="text-xl bg-red-400 rounded-md shadow-md flex items-center p-3 justify-center font-semibold">
            Add New Title (Part 3: Tagging)
          </h1>
          <div className="space-y-5">
            {/* Content Rating */}
            <div className="space-y-3">
              <p className="text-lg font-semibold">
                Content Rating (Selected:&nbsp;
                {selectedContentRating
                  ? selectedContentRating
                  : "No Tag Selected"}
                )
              </p>

              <div className="space-x-3">
                {tagsByContentRating.map((tag: any, index: any) => (
                  <button
                    type="button"
                    className={`px-2 inline-flex rounded-sm ${selectedContentRating === tag ? "bg-orange-500 " : "bg-gray-500"}`}
                    key={index}
                    onClick={() => handleSetSelectedCR(tag)} // Use tag directly here
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Origin */}
            <div className="space-y-3">
              <p className="text-lg font-semibold">
                Origin (Selected:&nbsp;
                {selectedOrigin ? selectedOrigin : "No Tag Selected"})
              </p>

              <div className="space-x-3">
                {tagsByOrigin.map((tag: any, index: any) => (
                  <button
                    type="button"
                    className={`px-2 inline-flex rounded-sm ${selectedOrigin === tag ? "bg-orange-500 " : "bg-gray-500"}`}
                    key={index}
                    onClick={() => handleSetSelectedOrigin(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className="space-y-3">
              <p className="text-lg font-semibold">
                Format (Selected:&nbsp;
                {selectedFormats.length > 0
                  ? selectedFormats.slice(0, 5).map((tag: any, index: any) => (
                      <span
                        key={index}
                        className="text-gray-600 text-sm italic"
                      >
                        {tag}
                        {index < 4 && ", "}
                      </span>
                    ))
                  : "No Tag Selected"}
                {selectedFormats.length > 5 && (
                  <span className="text-gray-600">...</span>
                )}
                )
              </p>

              <div className="space-x-3">
                {tagsByFormat.map((tag: any, index: any) => (
                  <button
                    type="button"
                    className={`px-2 inline-flex rounded-sm ${selectedFormats.includes(tag) ? "bg-orange-500 " : "bg-gray-500"}`}
                    key={index}
                    onClick={() => handleSetSelectedFormat(0, tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div className="space-y-3">
              <p className="text-lg font-semibold">
                Genres (Selected:&nbsp;
                {selectedGenres.length > 0
                  ? selectedGenres.slice(0, 5).map((tag: any, index: any) => (
                      <span
                        key={index}
                        className="text-gray-600 text-sm italic"
                      >
                        {tag}
                        {index < 4 && ", "}
                      </span>
                    ))
                  : "No Tag Selected"}
                {selectedGenres.length > 5 && (
                  <span className="text-gray-600">...</span>
                )}
                )
              </p>

              <div className="flex flex-wrap gap-x-3">
                {tagsByGenres.map((tag: any, index: any) => (
                  <button
                    type="button"
                    className={`px-2 inline-flex rounded-sm mb-3 ${selectedGenres.includes(tag) ? "bg-orange-500" : "bg-gray-500"}`}
                    key={index}
                    onClick={() => handleSetSelectedFormat(1, tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Themes */}
            <div className="space-y-3">
              <p className="text-lg font-semibold">
                Theme (Selected: &nbsp;{" "}
                {selectedThemes.length > 0
                  ? selectedThemes.slice(0, 5).map((tag: any, index: any) => (
                      <span className="text-sm text-gray-600 italic">
                        {tag}
                        {index < 4 && ", "}
                      </span>
                    ))
                  : "No Tag Selected"}
                {selectedThemes.length > 5 && (
                  <span className="text-gray-600">...</span>
                )}
                )
              </p>

              <div className="flex flex-wrap gap-x-3">
                {tagsByThemes.map((tag: any, index: any) => (
                  <button
                    type="button"
                    className={`px-2 inline-flex rounded-sm mb-3 ${selectedThemes.includes(tag) ? "bg-orange-500" : "bg-gray-500"}`}
                    key={index}
                    onClick={() => handleSetSelectedFormat(2, tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {Object.values(errorList).length > 0 && (
        <div className="mt-10  flex items-center flex-col">
          <span className="text-lg">You have the following errors:</span>
          <div className="text-base text-red-500 pl-1 mt-2 w-fit space-y-2 text-left self-center">
            {Object.values(errorList).map((error: any, index: any) => (
              <div
                className="flex bg-red-100 p-1 border-[1px] rounded-md"
                key={index}
              >
                <span className="font-bold ">⚠️</span>

                <p className="font-semibold">- {error}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-between mt-[3vw]">
        <button
          type="button"
          className={`bg-gray-400 rounded-md p-2 ${currentPage == 1 ? "cursor-not-allowed" : "hover:scale-110"}`}
          onClick={() => handleSetCurrentPage("-")}
        >
          Previous Page
        </button>
        {currentPage < 3 && (
          <button
            type="button"
            className={`bg-green-400 rounded-md p-2 ${currentPage == totalPages ? "cursor-not-allowed" : "hover:scale-110"}`}
            onClick={() => handleSetCurrentPage("+")}
          >
            Next Page
          </button>
        )}

        {currentPage == 3 && (
          <button
            type="button"
            className={`bg-green-400 rounded-md p-2 hover:scale-110`}
            onClick={() => handleSetCurrentPage("+")}
          >
            {/* {pending ? "Submitting" : "Done"} */}
            Submit
          </button>
        )}
      </div>
    </form>
  );
};
export default CreateMangaModal;
