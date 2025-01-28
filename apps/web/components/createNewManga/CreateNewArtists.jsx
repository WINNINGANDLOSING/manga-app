import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { getAllCreators } from "@/lib/actions";
import { all } from "axios";
import Fuse from "fuse.js";

const CreateNewArtists = ({ setArtistsParent, onClose }) => {
  const [fetchedDataArtists, setFetchedDataArtists] = useState([]);
  const [newArtists, setNewArtists] = useState([]);
  const [error, setError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const maxNewArtistsCount = 5;

  useEffect(() => {
    const fetchingCreator = async () => {
      const data = await getAllCreators();
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      setFetchedDataArtists(sortedData);
    };
    fetchingCreator();
  }, []);

  

  const checkingForDuplicate = (authorList) => {
    setErrorList([]);
    var flag = false;
    for (let i = 0; i < authorList.length; i++) {
      const isDuplicate = fetchedDataArtists.some(
        (author) =>
          author.name.toLowerCase() === authorList[i].name.toLowerCase()
      );
      if (isDuplicate) {
        flag = true;
        setErrorList((prevState) => {
          if (
            !prevState.some(
              (data) => data === `Duplicate: ${authorList[i].name}`
            )
          ) {
            return [...prevState, `Duplicate: ${authorList[i].name}`];
          }
          return prevState;
        });
      }
    }
    return flag;
  };

  

  const handleAddArtists = () => {
    if (newArtists.length < maxNewArtistsCount) {
      const updatedField = [...newArtists, { name: "" }];
      setNewArtists(updatedField);
    }
  };

  const handleRemoveArtists = (index) => {
    const updatedField = newArtists.filter((_, i) => i !== index);
    setNewArtists(updatedField);
  };

  const handleNewArtistsChange = (index, value) => {
    const updatedField = [...newArtists];
    updatedField[index]["name"] = value;
    setNewArtists(updatedField);
  };

  const handleSubmit = () => {
    if (newArtists.length === 0) {
      setError("Please add at least one author");
      return;
    }
    if (newArtists.some((author) => author.name === "")) {
      setError("Missing field: name for some artists.");
      return;
    }
    const isDuplicate = checkingForDuplicate(newArtists);
    if (isDuplicate) {
      setError("Duplicate Found");
      return;
    } else {
      setArtistsParent(newArtists);
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 py-6 px-5 rounded-xl shadow-xl w-[20vw] relative items-center justify-center">
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl  font-bold mb-4  text-orange-600">
          Add New Artists
        </h2>

        {newArtists.map((author, index) => (
          <div className="mt-3 flex" key={index}>
            <input
              type="text"
              onChange={(e) => handleNewArtistsChange(index, e.target.value)}
              className=" rounded-sm border-[1px] p-3 bg-gray-700 w-full border-gray-500 appearance-none outline-none "
              placeholder={`Enter Artist Name ${index + 1}`}
            />

            <button
              type="button"
              className="ml-1 text-red-500 w-3 h-3 p-3"
              onClick={() => handleRemoveArtists(index)}
            >
              X
            </button>
          </div>
        ))}

        <button
          type="button"
          className="mt-4 w-full self-center rounded-sm border-[1px] border-dashed p-2 flex items-center justify-center text-gray-400"
          onClick={handleAddArtists}
          disabled={newArtists.length >= maxNewArtistsCount}
        >
          <span className="text-2xl mr-2">+</span> Add
        </button>

        {/* Error Message */}
        <div className="text-center mt-5 text-red-500">
          {error && (
            <div className="  p-1 rounded-lg shadow-lg mb-1">
              <p className="text-lg font-semibold">{error}</p>
            </div>
          )}
          {errorList.length > 0 && (
            <div className="  space-y-2">
              {errorList.map((err, index) => (
                <div
                  key={index}
                  className="flex bg-red-100 p-1 rounded-lg shadow-lg border-[1px] items-start space-x-2"
                >
                  <span className="font-bold ">⚠️</span>
                  <p className="">{err}</p>
                </div>
              ))}
            </div>
          )}
        </div>

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

export default CreateNewArtists;
