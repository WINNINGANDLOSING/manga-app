"use client";

import React, { useEffect, useState } from "react";
import { MangaList } from "../../public/data/ExportedData";
import MangaCardVer2 from "../Helpers/MangaCardVer2";
import { getAllManga } from "@/lib/actions";

const LatestSection = () => {
  const [mangas, setMangas] = useState<any>(null);
  
  useEffect(() => {
    const fetching = async () => {
      try {
        const data = await getAllManga();
        setMangas(data);
      } catch (err) {
        console.log("Error fetching data");
      }
    };
    fetching();
  }, []);

  useEffect(() => {
    if(mangas && mangas !== null){
      console.log("LATEST");
      console.log(mangas)
    }
  }, [mangas])
  return (
    <div className="grid grid-rows-5 grid-cols-4 w-fit gap-x-10 ">
      {mangas &&
        mangas !== null &&
        mangas.map((manga: any, index: any) => (
          <MangaCardVer2 key={index} data={manga} />
        ))}
    </div>
  );
};

export default LatestSection;
