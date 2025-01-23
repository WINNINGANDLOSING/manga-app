"use client";

import React, { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import CreateNewAlternativeTitlesModal from "@/components/createNewManga/CreateNewAlternativeTitles";
import CreateNewSynopsisModal from "@/components/createNewManga/CreateNewSynopsisModal";
import { handleMangaPage1Submission } from "@/lib/actions";
const Page = () => {
  const { pending } = useFormStatus();

  // Linh Tinh
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagsByContentRating, setTagsByContentRating] = useState<string[]>([]);
  const [tagsByOrigin, setTagsByOrigin] = useState<string[]>([]);
  const [tagsByFormat, setTagsByFormat] = useState<string[]>([]);
  const [tagsByGenres, setTagsByGenres] = useState<string[]>([]);
  const [tagsByThemes, setTagsByThemes] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const handleSetCurrentPage = (operator: string) => {
    if (operator === "+") {
      const conditionsChecking =
        currentPage === 1
          ? title &&
            title !== "" &&
            coverImage &&
            coverImage !== null &&
            synopsis &&
            synopsis !== null
          : "";
      if (conditionsChecking) {
        setCurrentPage(currentPage + 1 <= 4 ? currentPage + 1 : currentPage);
      } else {
        window.alert("Missing info on page 1!");
      }
    } else {
      setCurrentPage(currentPage - 1 >= 1 ? currentPage - 1 : currentPage);
    }
  };

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
  const [selectedAuthors, setSelectedAuthors] = useState<any[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<any[]>([]);
  const [searchQueryAu, setSearchQueryAu] = useState<string>("");
  const [searchQueryAr, setSearchQueryAr] = useState<string>("");

  const [isFocusedAu, setIsFocusedAu] = useState(false);
  const [isFocusedAr, setIsFocusedAr] = useState(false);

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

  useEffect(() => {
    console.log("au focus ?", isFocusedAu);
  }, [isFocusedAu]);

  const handleOnClickAddAuthors = (queryType: string, selectedItem: any) => {
    console.log("Selected item:", selectedItem); // Log the selected author object

    if (queryType === "Au") {
      setSelectedAuthors((prevState) => {
        if (!prevState.some((data) => data === selectedItem)) {
          return [...prevState, selectedItem];
        }
        return prevState;
      });
    } else {
      setSelectedArtists((prevState) => {
        if (!prevState.some((data) => data === selectedItem)) {
          return [...prevState, selectedItem];
        }

        return prevState;
      });
    }
  };

  // useEffect(() => {
  //   if (fetchedDataCreators && fetchedDataCreators !== null) {
  //     console.log(fetchedDataCreators);
  //   }
  // }, [fetchedDataCreators]);
  const filteredAuthors = fetchedDataCreators.filter((creator) =>
    creator.name.toLowerCase().startsWith(searchQueryAu.toLowerCase())
  );

  const filteredArtists = fetchedDataCreators.filter((creator) =>
    creator.name.toLowerCase().startsWith(searchQueryAr.toLowerCase())
  );

  // Actual Form Data
  // Page 1
  const [title, setTitle] = useState<string>("");
  const [alternateTitles, setAlternateTitles] = useState<string[]>([]);
  useEffect(() => {
    console.log("alt titles", alternateTitles.length);
  }, [alternateTitles]);

  const [isOpenModalTitles, setIsOpenModalTitles] = useState(false);
  useEffect(() => {
    console.log("title modal status");
    console.log(isOpenModalTitles);
  }, [isOpenModalTitles]);
  const [coverImage, setCoverImage] = useState(null);
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    setCoverImage(file);
  };

  const handleImageRemove = () => {
    setCoverImage(null);
  };

  const [synopsis, setSynopsis] = useState(null);
  const [isOpenModalSynopsis, setIsOpenModalSynopsis] = useState(false);
  const handleSetModal = () => {
    setIsOpenModalTitles(true);
  };
  const handleOnClose = (type: string) => {
    if (type === "altT") {
      setIsOpenModalTitles(false);
    } else {
      setIsOpenModalSynopsis(false);
    }
  };
  useEffect(() => {
    if (title && title !== null) {
      console.log("title:", title);
    }
  }, [title]);

  const [state, action] = useFormState(handleMangaPage1Submission, undefined);

  return (
    <form
      action={action}
      className=" flex items-center justify-center text-2xl"
      // onSubmit={(e) => e.preventDefault()}
    >
      {currentPage == 1 && (
        <div className="space-y-5">
          <h1 className="text-xl bg-red-400 rounded-md shadow-md flex items-center p-3 justify-center font-semibold">
            Add New Title (Part 1: Title)
          </h1>
          <div className="flex w-full space-x-5">
            <div className="space-y-3 w-1/2">
              {state?.message && (
                <p className="text-sm text-red-500">{state.message}</p>
              )}
              <h2 className="font-semibold text-xl">
                Title&nbsp;
                <p className="text-pink-500 inline">(Required)</p>
              </h2>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                placeholder="Enter manga's title"
                className="bg-transparent w-full border-[1px] border-white rounded-sm min-h-[4rem] px-3 placeholder:text-xl text-xl overflow-y-hidden"
              />
              {state?.error?.title && (
                <p className="text-sm text-red-500">{state.error.title}</p>
              )}
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
              {/* <input
                id="alternative-titles"
                name="alternative-titles"
                value={alternateTitles}
                onChange={(e) => handleSetAlternateTitle(e.target.value)}
                className="bg-transparent w-full border-[1px] border-white rounded-sm p-3"
              /> */}
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
          <div className="space-y-3">
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
            {state?.error?.coverImage && (
              <p className="text-red-500 text-sm">{state.error.coverImage}</p>
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
          <div className="space-y-3">
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
                onClose={() => handleOnClose("")}
              />
            )}
            <p className="text-sm font-normal text-gray-400 leading-[0.5px]">
              Provide a brief summary of the plot, characters, and setting of
              the manga. This will help readers get an overview of the story.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-5">
        <button
          type="submit"
          className="bg-gray-600 text-white rounded-sm border-2 border-blue-600 p-2"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Page;
