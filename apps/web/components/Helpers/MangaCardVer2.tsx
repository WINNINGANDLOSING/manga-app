"use client";
import React, { useEffect, useState } from "react";
import { MangaCardProps } from "./MangaCardVer1";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

const MangaCardVer2 = ({ data }: MangaCardProps) => {
  
  // const [backgroundCover, setBackgroundCover] = useState<any>(null);
  const latestChapter = data?.chapters?.length ? data.chapters.length : 0;
  // useEffect(() => {
  //   const getBackgroundCover = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:3000/api/cloudinary/fetchBgCover",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ id }),
  //         }
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch images");
  //       }
  //       const data = await response.json();
  //       setBackgroundCover(data?.data || []);
  //     } catch (error) {
  //       console.error("Error fetching images:", error);
  //     }
  //   };

  //   getBackgroundCover();
  // }, []);

  return (
    <Link
      className="w-[10vw] h-fit mt-5 text-black font-normal text-sm hover:cursor-pointer flex flex-col"
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
        className="w-[10vw] h-[13.8vw] rounded-sm"
      ></img>

      <p className="font-bold mb-1 hover:text-orange-500 transition-all ease-in-out duration-500 line-clamp-2 overflow-hidden leading-4">
        {data.title}
      </p>

      <p className="hover:font-semibold">Chapter {latestChapter}</p>
    </Link>
  );
};

export default MangaCardVer2;
