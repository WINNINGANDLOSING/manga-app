"use client";
import React, { useEffect, useState } from "react";
import { MangaCardProps } from "./MangaCardVer1";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

const MangaCardVer2 = ({ data }: MangaCardProps) => {
  
  // const [backgroundCover, setBackgroundCover] = useState<any>(null);
  const latestChapter = data?.chapters?.length ? data.chapters.length : 0;
  
  return (
    <Link
      className="w-[10vw] h-fit mt-5 text-black  font-normal text-sm hover:cursor-pointer flex flex-col"
      href={{
        pathname: "/MangaDetail",
        query: {
          id: data.id,
        },
      }}
    >
      <img
        src={data.cover_image_url}
        alt="manga"
        className="w-[10vw] h-[13.8vw] rounded-md"
      ></img>

      <p className="font-bold mb-2 hover:text-orange-600 text-lg mt-2 transition-all ease-in-out duration-500 line-clamp-2 overflow-hidden leading-5 tracking-wide text-black dark:text-white">
        {data.title}
      </p>

      <p className="text-lg leading-5 hover:font-semibold text-gray-800 dark:text-gray-200 transition-all ease-in-out duration-300">
        {latestChapter === 0 ? "" : `Chapter ${latestChapter}`}
      </p>
    </Link>
  );
};

export default MangaCardVer2;
