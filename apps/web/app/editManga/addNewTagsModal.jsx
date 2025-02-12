"use client";
import { getAllTags } from "@/lib/actions";
import React, { useEffect, useState } from "react";

const AddNewTagsModal = ({ setTags, onClose }) => {
  const [loading, setLoading] = useState(true);

  const [allTags, setAllTags] = useState();
  useEffect(() => {
    const fetchingTags = async () => {
      const data = await getAllTags();
      setAllTags(data);
      setLoading(false);
    };
    fetchingTags();
  }, []);

  const [selectedTags, setSelectedTags] = useState({
    origin: "",
    format: [],
    genres: [],
    themes: [],
  });
  const handleOnClickTags1 = (tagType, tag) => {
    setSelectedTags((prevState) => {
      if (tagType === "origin") {
        return { ...prevState, origin: prevState.origin === tag ? null : tag };
      }
      const updatedList = prevState[tagType].includes(tag)
        ? prevState[tagType].filter((existingTag) => existingTag !== tag)
        : [...prevState[tagType], tag];

      return { ...prevState, [tagType]: updatedList };
    });
  };

  // Outdated
  // const [selectedOrigin, setSelectedOrigin] = useState([]);
  // const [selectedFormats, setSelectedFormats] = useState([]);
  // const [selectedGenres, setSelectedGenres] = useState([]);
  // const [selectedThemes, setSelectedThemes] = useState([]);

  // const handleOnClickTags = (tagType, tag) => {
  //   if (tagType === "origin") {
  //     setSelectedOrigin(selectedOrigin === tag ? null : tag);
  //   } else if (tagType === "formats") {
  //     setSelectedFormats((prevState) => {
  //       if (!prevState.some((existingTag) => existingTag === tag)) {
  //         return [...prevState, tag];
  //       } else {
  //         return prevState.filter((existingTag) => existingTag !== tag);
  //       }
  //     });
  //   } else if (tagType === "genres") {
  //     setSelectedGenres((prevState) => {
  //       if (!prevState.some((existingTag) => existingTag === tag)) {
  //         return [...prevState, tag];
  //       } else {
  //         return prevState.filter((existingTag) => existingTag !== tag);
  //       }
  //     });
  //   } else {
  //     setSelectedThemes((prevState) => {
  //       if (!prevState.some((existingTag) => existingTag === tag)) {
  //         return [...prevState, tag];
  //       } else {
  //         return prevState.filter((existingTag) => existingTag !== tag);
  //       }
  //     });
  //   }
  // };
  const [errorList, setErrorList] = useState([]);
  const handleSubmit = () => {
    const hasSelectedTags = Object.values(selectedTags).flat().some(Boolean);

    if (!hasSelectedTags) {
      alert("You must select at least one tag before submitting.");
      return;
    }

    if (
      window.confirm(`Are you sure you want to add the following tags: \n
      Category: Origin: [${selectedTags["origin"]}]\n
      Category: Formats: [${selectedTags["format"].join(", ")}]\n
      Category: Genres: [${selectedTags["genres"].join(", ")}]\n
      Category: Themes: [${selectedTags["themes"].join(", ")}]
      `)
    ) {
      const flatValues = Object.values(selectedTags).flat();
      setTags(flatValues);
      onClose();
    }
  };

  if (loading)
    return (
      <div className="inset-0 flex items-center justify-center bg-black shadow-lg text-white fixed z-40 bg-opacity-50">
        <div className="bg-black bg-opacity-90 space-y-3 px-5 py-3 rounded-lg w-full max-w-[60vw] shadow-lg text-center">
          Loading...
        </div>
      </div>
    );

  return (
    <div className="inset-0 flex items-center justify-center bg-black shadow-lg text-white fixed z-40 bg-opacity-50">
      <div className="bg-black bg-opacity-90 space-y-3 px-5 py-3 rounded-lg w-full max-w-[60vw] shadow-lg">
        <h1 className="text-2xl text-center">Adding Tags</h1>
        <div className="space-y-1">
          <h2>Origin</h2>

          {allTags && allTags.length > 0 && (
            <div className="flex space-x-2">
              {allTags
                .filter((tag) => tag.tag_type === "origin")
                .map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`text-xs py-1 px-2 rounded-sm  w-fit text-gray-300  h-fit ${selectedTags[tag.tag_type].includes(tag.name) ? "bg-orange-600" : "bg-gray-800"}`}
                    onClick={() => handleOnClickTags1("origin", tag.name)}
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h2>Formats</h2>
          {allTags && allTags.length > 0 && (
            <div className="space-x-2 flex">
              {allTags
                .filter((tag) => tag.tag_type === "format")
                .map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`text-xs py-1 px-2 rounded-sm  w-fit text-gray-300  h-fit ${selectedTags[tag.tag_type].includes(tag.name) ? "bg-orange-600" : "bg-gray-800"}`}
                    onClick={() => handleOnClickTags1("format", tag.name)}
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h2>Genres</h2>
          {allTags && allTags.length > 0 && (
            <div className="gap-2 flex flex-wrap">
              {allTags
                .filter((tag) => tag.tag_type === "genres")
                .map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`text-xs py-1 px-2 rounded-sm  w-fit text-gray-300  h-fit ${selectedTags[tag.tag_type].includes(tag.name) ? "bg-orange-600" : "bg-gray-800"}`}
                    onClick={() => handleOnClickTags1("genres", tag.name)}
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h2>Themes</h2>
          {allTags && allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags
                .filter((tag) => tag.tag_type === "themes")
                .map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`text-xs py-1 px-2 rounded-sm  w-fit text-gray-300  h-fit ${selectedTags[tag.tag_type].includes(tag.name) ? "bg-orange-600" : "bg-gray-800"}`}
                    onClick={() => handleOnClickTags1("themes", tag.name)}
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="flex ml-auto space-x-3 justify-end">
          <button
            type="button"
            className="bg-green-500 rounded-sm px-3 py-1 text-sm hover:scale-105 ease-in-out duration-200 transition-all"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
          <button
            type="button"
            className="bg-red-500 rounded-sm px-3 py-1 text-sm hover:scale-105 ease-in-out duration-200 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewTagsModal;
