"use client";
import React, { useEffect, useState } from "react";
import { MangaCardProps } from "./MangaCardVer1";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { late } from "zod";

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
      className="flex mb-5 space-x-5 pb-3 items-center border-b-[1px] border-b-gray-200"
      href={{
        pathname: "/MangaDetail",
        query: {
          id: data.id,
        },
      }}
    >
      <img
        src={data.cover_image_url}
        // key={index}
        alt="manga"
        className="w-[4vw] h-[6vw] hover:cursor-pointer"
      />
      <div className="flex flex-col text-[0.8vw]">
        <p className="text-[1vw] text-orange-500 font-bold hover:cursor-pointer">
          {data.title}
        </p>
        <p className="italic">Readers Count: 3000</p>
        <p className="font-bold hover:cursor-pointer">
          Chapter {latestChapter}
        </p>
      </div>
    </Link>
  );
};

export default MangaCardVer2;
