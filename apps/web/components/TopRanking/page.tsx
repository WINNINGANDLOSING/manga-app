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
import MangaCardVer2 from "../Helpers/MangaCardVer3";
import MangaCardVer3 from "../Helpers/MangaCardVer3";

const TopSection = () => {
  const [ByMonthData, setTopByMonthData] = useState<any>(null);
  const [ByWeekData, setTopMangaByWeek] = useState<any>(null);
  const [ByDayData, setTopByDayData] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("ByMonth");
  const [latestChapter, setLatestChapter] = useState();
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

  return (
    <div className="flex flex-col text-black max-w-[24vw] bg-gradient-to-br from-orange-400 to-orange-600 rounded-md shadow-lg border-t-0 border-[0.1vw] p-3 text-sm">
      <div className="flex items-center space-x-2 mb-3 text-2xl">
        <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
        <h1 className="font-bold font-mono text-white">Top Rated</h1>
      </div>
      <div className="flex font-semibold ">
        {/* // Top Thang */}
        <div
          className={`flex justify-center w-[8vw] items-center rounded-t-md hover:cursor-pointer p-2 border-b-2 border-b-gray-300 border-r-2 border-opacity-50 border-r-gray-300 ${currentTab === "ByMonth" ? "bg-white border-t-2 border-t-orange-400" : "bg-gray-200"}`}
          onClick={() => setCurrentTab("ByMonth")}
        >
          <p>Top By Month</p>
        </div>
        <div
          className={`flex justify-center w-[8vw] items-center  rounded-t-md hover:cursor-pointer p-2 border-b-2 border-opacity-50 border-r-gray-300 ${currentTab === "ByWeek" ? "bg-white border-t-2 border-t-orange-400" : "bg-gray-200"}`}
          onClick={() => setCurrentTab("ByWeek")}
        >
          <p>Top By Week</p>
        </div>
        <div
          className={`flex justify-center w-[8vw] items-center rounded-t-md hover:cursor-pointer p-2 border-b-2 border-b-gray-300 border-l-gray-300 border-l-2 border-opacity-50  ${currentTab === "ByDay" ? "bg-white border-t-2 border-t-orange-400" : "bg-gray-200"}`}
          onClick={() => setCurrentTab("ByDay")}
        >
          <p>Top By Day</p>
        </div>
      </div>
      <div className="flex flex-col p-5 pb-0 bg-white rounded-b-md ">
        {/* <p className="text-[2vw]">1</p>
        <Image
          src={mangaListTest.img_src}
          alt="manga"
          className="w-[4vw] h-[6vw]"
        />
        <div className="flex flex-col text-[0.8vw] space-y-2">
          <p className="text-[1vw] text-orange-500 font-bold">{mangaListTest.title}</p>
          <p className="italic">Readers Count: 3000</p>
          <p className="font-bold">Chapter {mangaListTest.latestChapter}</p>
        </div> */}
        {ByMonthData &&
          ByMonthData !== null &&
          ByMonthData.map((manga: any, index: any) => (
            <MangaCardVer3 key={index} data={manga} />
          ))}
      </div>
    </div>
  );
};

export default TopSection;
