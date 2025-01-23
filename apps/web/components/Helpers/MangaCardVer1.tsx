import React from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
//import { globalContext } from "@/lib/context";
export interface MangaCardProps {
  data: {
    id: number;
    title: string;
    // latestChapter: number;
    chapters: [];

    cover_image_url: string; // Adjust if you're using a different type for images
    genres: string[];
    authors: string[];
    view_counts: number;
    status: string;
    description: string;
  };
}

const MangaCardVer1 = ({ data }: MangaCardProps) => {
  //const { manga_1 } = globalContext();
  const latestChapter = data?.chapters?.length ? data.chapters.length : 0;
  return (
    <Link
      className="relative w-[10vw] h-[14vw] hover:cursor-pointer border-orange-500 border-[1px] rounded-sm "
      // href={`/MangaDetail/${manga_id}`}
      href={{
        pathname: "/MangaDetail",
        query: {
          id: data.id,
        },
      }}
    >
      <img
        src={data.cover_image_url}
        alt="cover"
        className="w-[10vw] h-[13.8vw] rounded-sm"
      />
      <div className="absolute bottom-0 w-full text-black h-[4vw] bg-gray-300 bg-opacity-80  flex flex-col px-[0.5vw]">
        <p className="font-bold text-[0.8vw] hover:text-blue-500 transition-all duration-500 ease-in-out line-clamp-2 overflow-hidden leading-4">
          {data.title}
        </p>
        <p className="absolute text-[0.7vw] hover:text-blue-500 transition-all duration-500 ease-in-out bottom-0   font-semibold left-3">
          Ch. {latestChapter}
        </p>
      </div>
    </Link>
  );
};

export default MangaCardVer1;
