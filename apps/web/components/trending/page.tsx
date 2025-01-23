"use client";
import React, { useEffect, useState } from "react";
import MangaCardVer1 from "../Helpers/MangaCardVer1";
import { MangaList, TrendingData } from "../../public/data/ExportedData";

const TrendingSection = () => {
  const [mangas, setMangas] = useState<any>(null);
  const [paginatedManga, setPaginatedManga] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetching = async () => {
      try {
        const data = await TrendingData();
        setMangas(data);
      } catch (err) {
        console.log("FAILED TO FETCH DATA");
      } 
    };
    fetching();
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [animationKey, setAnimationKey] = useState(0); // Key for triggering re-render with animation
  const itemsPerPage = 5;

  const startIndex = currentPage * itemsPerPage;

  // useEffect(() => {
  //   if (mangas && mangas !== null) {
  //     console.log(mangas);
  //   }
  // }, [mangas]);
  useEffect(() => {
    //console.log(currentPage);
    if (mangas && mangas != null) {
      setPaginatedManga(mangas.slice(startIndex, startIndex + itemsPerPage));
    }
  }, [mangas, currentPage]);

  const handleNext = () => {
    if ((currentPage + 1) * itemsPerPage < mangas.length) {
      setAnimationKey((prev) => prev + 1); // Update key for transition
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setAnimationKey((prev) => prev + 1); // Update key for transition
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-fit">
      {/* Navigation Buttons */}
      <div className="flex gap-2 ml-auto">
        <div className="flex items-center justify-center bg-gray-200 h-8 w-8 rounded-full shadow-md border border-gray-400">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className={`text-gray-700 mb-[0.1vw] font-semibold text-lg ${
              currentPage === 0
                ? "cursor-not-allowed text-gray-400"
                : "hover:text-blue-600 hover:scale-110 transition-transform duration-200"
            }`}
          >
            &lt;
          </button>
        </div>

        <div className="flex items-center justify-center bg-gray-200 h-8 w-8 rounded-full shadow-md border border-gray-400">
          {mangas && mangas !== null && (
            <button
              onClick={handleNext}
              disabled={(currentPage + 1) * itemsPerPage >= mangas.length}
              className={`text-lg mb-[0.1vw] text-gray-700 font-semibold ${
                (currentPage + 1) * itemsPerPage >= mangas.length
                  ? "cursor-not-allowed"
                  : "hover:cursor-pointer hover:text-blue-600 hover:scale-110 transition-transform duration-200"
              }`}
            >
              &gt;
            </button>
          )}
        </div>
      </div>

      {/* Manga List with Animation */}
      <div
        key={animationKey}
        className="flex gap-10 flex-wrap justify-start transition-opacity duration-300 ease-in-out opacity-100 animate-fade-in"
      >
        {paginatedManga &&
          paginatedManga !== null &&
          paginatedManga.map((manga: any, index: any) => (
            <MangaCardVer1 key={index} data={manga} />
          ))}
      </div>
      <div className="flex item-center space-x-2 justify-center text-black font-normal text-base">
        <div
          className={`cursor-pointer border-[1.5px] border-black w-3 h-3 ${currentPage === 0 ? "bg-orange-400" : "bg-white"} `}
          style={{ borderRadius: "60px" }}
          onClick={() => {
            setCurrentPage(0);
          }}
        ></div>
        <div
          className={`cursor-pointer border-[1.5px] border-black w-3 h-3 ${currentPage === 1 ? "bg-orange-400" : "bg-white"} `}
          style={{ borderRadius: "60px" }}
          onClick={() => {
            setCurrentPage(1);
          }}
        ></div>
        <div
          className={`cursor-pointer border-[1.5px] border-black w-3 h-3 ${currentPage === 2 ? "bg-orange-400" : "bg-white"} `}
          style={{ borderRadius: "60px" }}
          onClick={() => {
            setCurrentPage(2);
          }}
        ></div>
      </div>
    </div>
  );
};

export default TrendingSection;
