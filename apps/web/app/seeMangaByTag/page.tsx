"use client";
import MangaCardVer1 from "@/components/Helpers/MangaCardVer1";
import MangaCardVer2 from "@/components/Helpers/MangaCardVer2";
import { getMangaByCreator, getMangaByTag } from "@/lib/actions";
import React, { useEffect, useState } from "react";

interface mangaData {
  data: Object;
}

const Page = ({
  searchParams,
}: {
  searchParams: {
    type: string;
    tag: string;
  };
}) => {
  const type = searchParams.type;
  const tag = searchParams.tag;
  const [queryData, setqueryData] = useState<mangaData[] | null>(null);

  useEffect(() => {
    const queryingData = async () => {
      const data =
        type === "tag"
          ? await getMangaByTag(tag)
          : await getMangaByCreator(tag);
      setqueryData(data);
    };
    queryingData();
  }, []);

  useEffect(() => {
    console.log(queryData);
  }, [queryData]);

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-8 space-y-8 min-h-screen text-white flex flex-col">
      {/* <header className="text-center">
        <h1 className="text-3xl font-semibold text-orange-400">
          Manga Filter: <span className="font-bold">{tag}</span>
        </h1>
        <p className="text-lg text-gray-300 mt-2">
          Showing results for {type === "tag" ? "tag" : "creator"}:{" "}
          <span className="text-yellow-500">{tag}</span>
        </p>
      </header> */}
      <header className="text-center">
        <h1 className="text-3xl font-semibold text-orange-500">
          Manga Filter: <span>{tag}</span>
        </h1>
        <p className="text-lg text-gray-300 mt-2">
          Showing result for {type === "tag" ? "tag" : "creator"}&nbsp;
          <span className="text-yellow-500">{tag}</span>
        </p>
      </header>

      {queryData !== null ? (
        <div className="px-28 grid-cols-3 grid gap-10   max-w-[100vw] self-center">
          {queryData.map((data: any, index: any) => (
            <MangaCardVer1 key={index} data={data} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-400">
            No manga found for this filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
