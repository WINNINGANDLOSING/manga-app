"use client";
import { getAllCreators } from "@/lib/actions";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
const AddNewCreatorsModal = ({ setCreators, onClose }) => {
  const [loading, setLoading] = useState(true);

  const [allCreators, setAllCreators] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState({
    authors: [],
    artists: [],
  });
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchQueryAu, setSearchQueryAu] = useState("");
  const [searchQueryAr, setSearchQueryAr] = useState("");

  useEffect(() => {
    const fetchingCreators = async () => {
      const data = await getAllCreators();
      const formatted_data = data.sort((a, b) => a.name.localeCompare(b.name));
      setAllCreators(formatted_data);
      setLoading(false);
    };
    fetchingCreators();
  }, []);

  useEffect(() => {
    if (allCreators && allCreators.length > 0) {
      const filteredAu = [
        ...allCreators.filter((creator) =>
          creator.name.toLowerCase().startsWith(searchQueryAu.toLowerCase())
        ),
        // { name: "Add Author +", id: "add-author" }, // Adding the 'Add Author +' option at the end
      ];
      const filteredAr = [
        ...allCreators.filter((creator) =>
          creator.name.toLowerCase().startsWith(searchQueryAr.toLowerCase())
        ),
        // { name: "Add Artist +", id: "add-author" }, // Adding the 'Add Author +' option at the end
      ];

      setFilteredArtists(filteredAr);
      setFilteredAuthors(filteredAu);
    }
  }, [searchQueryAu, searchQueryAr]);

  useEffect(() => {
    console.log("selectedCreators", selectedCreators);
  }, [selectedCreators]);
  const handleOnClickAddAuthors = (type, creator) => {
    setSelectedCreators((prev) => {
      const updatedList = prev[type].includes(creator)
        ? prev[type]
        : [...prev[type], creator];
      if (type === "authors") {
        setSearchQueryAu("");
      } else {
        setSearchQueryAr("");
      }
      return { ...prev, [type]: updatedList };
    });
  };

  const handleSubmit = () => {
    const hasSelectedCreators = Object.values(selectedCreators)
      .flat()
      .some(Boolean);

    if (!hasSelectedCreators) {
      alert("You must select at least one tag before submitting.");
      return;
    }

    if (
      window.confirm(`Are you sure you want to add the following Creators: \n
Authors: [${selectedCreators["authors"]
        .map(
          (author, index) =>
            `${author.name}${index !== selectedCreators["authors"].length - 1 ? ", " : ""}`
        )
        .join("")}] \n
Artists: [${selectedCreators["artists"]
        .map(
          (author, index) =>
            `${author.name}${index !== selectedCreators["artists"].length - 1 ? ", " : ""}`
        )
        .join("")}] \n
      `)
    ) {
      const flatValues = Object.values(selectedCreators).flat();
      setCreators(selectedCreators);
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
      <div className="bg-black bg-opacity-90 space-y-3 px-5 py-3 rounded-lg  w-full max-w-[40vw] shadow-lg">
        <h1 className="text-2xl text-center">Adding Creators</h1>
        <div className="space-y-2">
          <h2>Authors</h2>
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
              // ref={inputRefAu}
              // onFocus={() => handleFocus("Au")}
              // onBlur={() => handleBlur("Au")}
            />

            {/* Custom Dropdown for Authors */}
            <div
              className={`absolute left-0 right-0 top-full mt-1 bg-gray-800 text-white border-gray-200 rounded-sm shadow-lg z-10 overflow-hidden ${searchQueryAu ? "block" : "hidden"} `}
            >
              <div className={`max-h-[7vw] overflow-y-auto`}>
                {filteredAuthors.length === 0 && (
                  <div className="text-gray-500 p-2">No authors found</div>
                )}
                {searchQueryAu !== "" &&
                  filteredAuthors.map((author, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-700 `}
                      onClick={() => handleOnClickAddAuthors("authors", author)}
                    >
                      {author.name}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {selectedCreators["authors"] &&
            selectedCreators["authors"].length > 0 && (
              <div className="flex space-x-2">
                {selectedCreators["authors"].map((author, index) => (
                  <div
                    className="bg-gray-600 rounded-sm text-gray-300 text-xs px-2"
                    key={index}
                  >
                    {author.name}
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="space-y-2 mt-5">
          <h2>Artists</h2>
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
              className="search-input w-full outline-none p-3 bg-gray-800 text-white"
              // ref={inputRefAu}
              // onFocus={() => handleFocus("Au")}
              // onBlur={() => handleBlur("Au")}
            />
            {/* Custom Dropdown for Artists */}
            <div
              className={`absolute left-0 right-0 top-full mt-1 bg-gray-800 text-white border-gray-200 rounded-sm shadow-lg z-10 overflow-hidden ${searchQueryAr ? "block" : "hidden"} `}
            >
              <div className={`max-h-[7vw] overflow-y-auto`}>
                {filteredArtists.length === 0 && (
                  <div className="text-gray-500 p-2">No artist found</div>
                )}
                {searchQueryAr !== "" &&
                  filteredArtists.map((artist, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-700 `}
                      onClick={() => handleOnClickAddAuthors("artists", artist)}
                    >
                      {artist.name}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {selectedCreators["artists"] &&
            selectedCreators["artists"].length > 0 && (
              <div className="flex space-x-2">
                {selectedCreators["artists"].map((artist, index) => (
                  <div
                    className="bg-gray-600 rounded-sm text-gray-300 text-xs px-2"
                    key={index}
                  >
                    {artist.name}
                  </div>
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

export default AddNewCreatorsModal;
