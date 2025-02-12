import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

const CreateNewAlternativeTitlesModal = ({ setAlternativeTitles, onClose }) => {
  const [titles, setTitles] = useState([]); // Store titles in an array
  const [error, setError] = useState("");
  const maxTitleCount = 5;

  const handleAddTitle = () => {
    if (titles.length < maxTitleCount) {
      const updatedTitles = [...titles, { flag: "", content: "" }];
      // Check if the state really needs to be updated
      if (updatedTitles.length !== titles.length) {
        setTitles(updatedTitles);
      }
    }
  };

  const handleRemoveTitle = (index) => {
    const updatedTitles = titles.filter((_, i) => i !== index);
    setTitles(updatedTitles);
  };

  // const handleTitleChange = (index, value, type) => {
  //   const updatedTitles = [...titles];

  //   if (type === "flag") {
  //     updatedTitles[index]["flag"] = value;
  //   } else {
  //     updatedTitles[index]["content"] = value;
  //   }

  //   // Update either 'flag' or 'content'
  //   setTitles(updatedTitles);
  // };
  const handleTitleChange = (index, value, type) => {
    const updatedTitles = [...titles];

    // if (type === "flag") {
    //   updatedTitles[index]["flag"] = value;
    // } else {
    //   updatedTitles[index]["content"] = value;
    // }
    updatedTitles[index][type] = value;
    // Update either 'flag' or 'content'
    setTitles(updatedTitles);
  };

  const handleSubmit = () => {
    if (titles.length === 0) {
      setError("There must be at least one alternative title");
      return;
    }
    if (
      titles.some((title) => title.content.trim() === "") ||
      titles.some((title) => title.flag === "")
    ) {
      setError("All titles must be filled.");
      return;
    }

    // If everything is valid, pass the titles to setAlternativeTitles
    setAlternativeTitles(titles);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 py-6 px-5 rounded-xl shadow-xl w-[40vw] relative items-center justify-center">
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl  font-bold mb-4 text-center text-orange-600">
          Add Alternative Titles
        </h2>

        {titles.map((title, index) => (
          <div className="mt-3 flex" key={index}>
            <select
              defaultValue=""
              className={`w-3/12 bg-gray-700 border-[1px] rounded-sm rounded-r-none outline-none font-mono text-base text-centerd pl-1`}
              onChange={(e) => handleTitleChange(index, e.target.value, "flag")}
            >
              <option
                value=""
                className="bg-gray-800 text-base text-white text-center"
                disabled
              >
                Language
              </option>
              <option value="🇯🇵" className="bg-gray-800 text-base text-white">
                🇯🇵 Japanese
              </option>
              <option value="🇰🇷" className="bg-gray-800 text-base text-white">
                🇰🇷 Korean
              </option>
              <option value="🇹🇭" className="bg-gray-800 text-base text-white">
                🇹🇭 Thailand
              </option>
              <option value="🇬🇧" className="bg-gray-800 text-base text-white">
                🇬🇧 English
              </option>
              <option value="🇨🇳" className="bg-gray-800 text-base text-white">
                🇨🇳 Chinese
              </option>
              <option value="🇫🇷" className="bg-gray-800 text-base text-white">
                🇫🇷 French
              </option>
              <option value="🇪🇸" className="bg-gray-800 text-base text-white">
                🇪🇸 Spanish
              </option>
              <option value="🇩🇪" className="bg-gray-800 text-base text-white">
                🇩🇪 German
              </option>
              <option value="🇮🇹" className="bg-gray-800 text-base text-white">
                🇮🇹 Italian
              </option>
              <option value="🇧🇷" className="bg-gray-800 text-base text-white">
                🇧🇷 Portuguese
              </option>
              <option
                value="russian"
                className="bg-gray-800 text-base text-white"
              >
                🇷🇺 Russian
              </option>
            </select>

            <input
              type="text"
              onChange={(e) =>
                handleTitleChange(index, e.target.value, "content")
              }
              className=" rounded-sm border-[1px] p-3 bg-gray-700 w-full rounded-l-none appearance-none outline-none border-l-0"
              placeholder={`Enter Alt Title ${index + 1}`}
            />

            <button
              type="button"
              className="ml-1 text-red-500 w-3 h-3 p-3"
              onClick={() => handleRemoveTitle(index)}
            >
              X
            </button>
          </div>
        ))}

        {/* Button to add a new title */}
        <div className="w-full  flex  justify-center">
          <button
            type="button"
            className="mt-4 w-[20vw]   rounded-sm border-[1px] border-dashed p-2 flex items-center justify-center text-gray-400"
            onClick={handleAddTitle}
            disabled={titles.length >= maxTitleCount}
            key="add-title-button" // Adding a key to the button helps React with rendering optimizations
          >
            <span className="text-2xl mr-2">+</span> Add Alternative Title
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewAlternativeTitlesModal;
