import React, { useState } from "react";

const CreateNewSynopsisModal = ({ setSynopsis, onClose }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const wordCount = value.trim().split(/\s+/).length; // Split by spaces and count words
    if (wordCount < 5) {
      setError("Synopsis must contain at least 5 words.");
      return;
    }
    setSynopsis(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[40vw] text-xl min-h-[40vh] relative text-black">
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">
          Create New Synopsis
        </h2>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write your synopsis here..."
          className="w-full h-[30vh] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-800 overflow-y-auto"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex justify-end gap-4 mt-4">
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

export default CreateNewSynopsisModal;
