"use client";

import React, { useEffect, useState } from "react";
import { MangaList } from "../../public/data/ExportedData";
import MangaCardVer2 from "../../components/Helpers/MangaCardVer2";
import { getAllManga, getAllTags } from "@/lib/actions";

const TestingFetching = () => {
  const [mangas, setMangas] = useState<any>();

  useEffect(() => {
    const fetching = async () => {
      try {
        const data = await getAllTags();
        setMangas(data);
      } catch (err) {
        console.log("Error fetching data");
      }
    };


    fetching();
  }, []);

  useEffect(() => {
    if (mangas && mangas !== null) {
      console.log("LATEST");
      console.log(mangas);
    }
  }, [mangas]);
  return (
    <div className="grid grid-rows-5 grid-cols- gap-x-10 bg-black h-screen w-screen "></div>
  );
};

export default TestingFetching;
