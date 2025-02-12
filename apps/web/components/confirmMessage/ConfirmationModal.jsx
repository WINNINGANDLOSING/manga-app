import { useState } from "react";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 py-6 px-5 rounded-xl shadow-xl w-[30vw] relative">
        <h2 className="text-xl font-semibold text-white text-center mb-4">
          {message}
        </h2>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};


export default App;
