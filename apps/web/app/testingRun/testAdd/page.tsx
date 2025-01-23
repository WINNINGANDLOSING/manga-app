"use client";

import React, { useEffect, useState } from "react";
import { MangaList } from "../../../public/data/ExportedData";
import MangaCardVer2 from "../../../components/Helpers/MangaCardVer2";
import { addNewManga, getAllManga, getAllTags } from "@/lib/actions";

const TestingAdding = () => {
  const title = "TITLE TEST";
  const description = "Sample description";
  const authors = "Author A";
  const genres = ["Genre 1", "Genre 2"];
  const cover_image_url = "NOMORE";
  const viewCount = 0;
  const status = "Ongoing";

  useEffect(() => {
    const fetching = async () => {
      try {
        const data = await addNewManga(
          title,
          description,
          authors,
          genres,
          cover_image_url,
          viewCount,
          status
        );
      } catch (err) {
        console.log("Error fetching data");
      }
    };

    fetching();
  }, []);

  return (
    <div className="grid grid-rows-5 grid-cols- gap-x-10 bg-black h-screen w-screen "></div>
  );
};

export default TestingAdding;
