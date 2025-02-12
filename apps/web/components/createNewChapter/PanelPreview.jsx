import React from "react";

const PanelPreview = ({ panels, setIsOpen }) => {
  console.log("panels", panels);
  return (
    <div className="inset-0 flex space-x-3 justify-center bg-black shadow-lg text-white fixed z-40 bg-opacity-50">
      <div className="space-y-1  pt-3  flex flex-col items-center w-fit overflow-y-auto">
        {Object.values(panels).map((panel, index) => (
          <img
            key={index}
            src={URL.createObjectURL(panel)}
            alt="Selected Cover"
            className=" w-[40vw] h-[100vh] border rounded"
            onLoad={() => URL.revokeObjectURL(URL.createObjectURL(panel))}
          ></img>
        ))}
      </div>
      <button
        className="text-xl text-black bg-white font-bold w-fit h-fit px-2 rounded-md"
        onClick={() => setIsOpen(false)}
      >
        X
      </button>
    </div>
  );
};

export default PanelPreview;
