"use client";
import {
  TopByMonthData,
  TopByWeekData,
  TopByDayData,
} from "@/public/data/ExportedData";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const TopSection = () => {
  const [ByMonthData, setTopByMonthData] = useState<any>(null);
  const [ByWeekData, setTopMangaByWeek] = useState<any>(null);
  const [ByDayData, setTopByDayData] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("ByMonth");
  const [latestChapters, setLatestChapters] = useState<{
    [id: string]: number;
  }>({});

  useEffect(() => {
    const fetching = async () => {
      try {
        const dataMonth = await TopByMonthData();
        const dataWeek = await TopByWeekData();
        const dataDay = await TopByDayData();
        setTopByMonthData(dataMonth);
        setTopMangaByWeek(dataWeek);
        setTopByDayData(dataDay);
      } catch (err) {
        console.log("Failed to fetch data");
      }
    };
    fetching();
  }, []);

  const getLatestChapter = async (id: string) => {
    try {
      const query = await fetch(`http://localhost:7000/manga/${id}`);
      const manga = await query.json();
      const latestChapter = manga?.chapters?.length
        ? Math.max(
            ...manga.chapters.map((chapter: any) =>
              parseFloat(chapter.chapter_number)
            )
          )
        : 0;

      setLatestChapters((prev) => ({
        ...prev,
        [id]: latestChapter,
      }));
    } catch (error) {
      console.error("Error fetching latest chapter:", error);
    }
  };

  useEffect(() => {
    if (ByMonthData) {
      ByMonthData.forEach((manga: any) => {
        if (!latestChapters[manga.id]) {
          getLatestChapter(manga.id);
        }
      });
    }
  }, [ByMonthData]);

  return (
    <div className="flex flex-col text-black max-w-[24vw] bg-gradient-to-br from-orange-400 to-orange-600 rounded-md shadow-lg border-t-0 border-[0.1vw] p-3 text-sm">
      <div className="flex items-center space-x-2 mb-3 text-2xl">
        <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
        <h1 className="font-bold font-mono text-white">Top Rated</h1>
      </div>
      <div className="flex font-semibold">
        <div
          className={`flex justify-center w-[8vw] items-center rounded-t-md hover:cursor-pointer p-2 border-b-2 border-b-gray-300 border-r-2 border-opacity-50 border-r-gray-300 ${
            currentTab === "ByMonth"
              ? "bg-white border-t-2 border-t-orange-400"
              : "bg-gray-200"
          }`}
          onClick={() => setCurrentTab("ByMonth")}
        >
          <p>Top By Month</p>
        </div>
        <div
          className={`flex justify-center w-[8vw] items-center rounded-t-md hover:cursor-pointer p-2 border-b-2 border-opacity-50 border-r-gray-300 ${
            currentTab === "ByWeek"
              ? "bg-white border-t-2 border-t-orange-400"
              : "bg-gray-200"
          }`}
          onClick={() => setCurrentTab("ByWeek")}
        >
          <p>Top By Week</p>
        </div>
        <div
          className={`flex justify-center w-[8vw] items-center rounded-t-md hover:cursor-pointer p-2 border-b-2 border-b-gray-300 border-l-gray-300 border-l-2 border-opacity-50  ${
            currentTab === "ByDay"
              ? "bg-white border-t-2 border-t-orange-400"
              : "bg-gray-200"
          }`}
          onClick={() => setCurrentTab("ByDay")}
        >
          <p>Top By Day</p>
        </div>
      </div>
      <div className="flex flex-col p-5 pb-0 bg-white rounded-b-md">
        {ByMonthData &&
          ByMonthData.map((manga: any, index: number) => (
            <Link
              key={index}
              className="flex mb-5 space-x-5 pb-3 items-center border-b-[1px] border-b-gray-200"
              href={{
                pathname: "/MangaDetail",
                query: {
                  id: manga.id,
                },
              }}
            >
              <img
                src={manga.cover_image_url}
                alt="manga"
                className="w-[4vw] h-[6vw] hover:cursor-pointer"
              />
              <div className="flex flex-col text-[0.8vw]">
                <p className="text-[1vw] text-orange-500 font-bold hover:cursor-pointer">
                  {manga.title}
                </p>
                <p className="italic">Readers Count: 3000</p>
                <p className="font-bold hover:cursor-pointer">
                  Chapter {latestChapters[manga.id] || "Loading..."}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default TopSection;
