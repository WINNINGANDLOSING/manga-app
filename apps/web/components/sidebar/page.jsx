"use client";
import React, { useEffect, useState } from "react";
import {
  faCaretUp,
  faCaretDown,
  faSquareMinus,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminSidebar = ({ currentTab, setTab, subTab, setSubTab  }) => {
  const [isOpenMangaSubTab, SetIsOpenMangaSubTab] = useState(true);
  const [isOpenUserSubTab, SetIsOpenUserSubTab] = useState(true);
  const [clickCount, setClickCount] = useState(0);

  const handleSetTab = (tab) => {
    if (tab === "users") {
      setSubTab("view-users");
    } else if (tab === "mangas") {
      setSubTab("view-mangas");
    }
    setTab(tab);
  };
  const handleClick = (tab) => {
    if (clickCount === 0) {
      setClickCount(1);
      handleSetTab(tab);
      setTimeout(() => setClickCount(0), 300); // Reset click count after 300ms (time to detect double-click)
    } else {
      handleDoubleClick(tab); // Double-click detected
      setClickCount(0); // Reset click count immediately after double-click
    }
  };
  const handleDoubleClick = (tab) => {
    if (tab === "users") {
      SetIsOpenUserSubTab(!isOpenUserSubTab);
    } else {
      SetIsOpenMangaSubTab(!isOpenMangaSubTab);
    }
  };

  const handleSetSubTab = (subTab) => {
    setSubTab(subTab);
    if (subTab === "view-mangas" || subTab === "add-mangas") {
      setTab("mangas");
    } else if (subTab === "view-users" || subTab === "add-users") {
      setTab("users");
    }
  };

  return (
    <nav className="w-1/4 bg-gray-800 text-white font-semibold shadow-md p-5 rounded-md min-h-[20vw]">
      <ul className="space-y-4">
        <li
          className={`p-3 rounded-md cursor-pointer ${
            currentTab === "dashboard"
              ? "bg-orange-300 text-black font-semibold"
              : "hover:bg-orange-300 hover:text-black"
          }`}
          onClick={() => setTab("dashboard")}
        >
          <p className="font-semibold  text-xl">Dashboard</p>
        </li>

        {/* Manage Manga */}
        <li>
          <div className="flex items-center space-x-5">
            <p
              className={`px-3 py-2 rounded-md w-[18vw] text-xl  cursor-pointer ${
                currentTab === "mangas"
                  ? "bg-orange-300 text-black font-semibold"
                  : "hover:bg-orange-300 hover:text-black"
              }`}
              onClick={() => handleClick("mangas")}
            >
              Manage Mangas
            </p>
            <button
              className="text-xl hover:text-orange-300 transition"
              onClick={() => SetIsOpenMangaSubTab(!isOpenMangaSubTab)}
              aria-expanded={isOpenMangaSubTab}
              aria-label="Toggle Manage Mangas"
            >
              {/* {isOpenMangaSubTab ? "-" : "+"} */}
              {isOpenMangaSubTab ? (
                <FontAwesomeIcon
                  icon={faSquareMinus}
                  style={{ color: "#FFD43B" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faSquarePlus}
                  style={{ color: "#FFD43B" }}
                />
              )}
            </button>
          </div>
          {isOpenMangaSubTab && (
            <div className="mt-3 space-y-5 ml-5 text-lg">
              <div
                className={`px-3 py-2 rounded-md cursor-pointer w-[13vw] ${
                  currentTab === "mangas" && subTab === "view-mangas"
                    ? "bg-orange-300 text-black font-semibold"
                    : "hover:bg-orange-300 hover:text-black"
                }`}
                onClick={() => handleSetSubTab("view-mangas")}
              >
                View Mangas
              </div>
              <div
                className={`px-3 py-2 rounded-md cursor-pointer  w-[13vw] ${
                  currentTab === "mangas" && subTab === "add-mangas"
                    ? "bg-orange-300 text-black font-semibold"
                    : "hover:bg-orange-300 hover:text-black"
                }`}
                onClick={() => handleSetSubTab("add-mangas")}
              >
                Add New Manga
              </div>

              <div
                className={`px-3 py-2 rounded-md cursor-pointer  w-[13vw] ${
                  currentTab === "mangas" && subTab === "add-mangas-api"
                    ? "bg-orange-300 text-black font-semibold"
                    : "hover:bg-orange-300 hover:text-black"
                }`}
                onClick={() => handleSetSubTab("add-mangas-api")}
              >
                Add New Manga (MangaDex API)
              </div>
            </div>
          )}
        </li>

        {/* Manage Users */}
        <li>
          <div className="flex items-center space-x-5">
            <p
              className={`px-3 py-2 rounded-md cursor-pointer w-[18vw] text-xl  ${
                currentTab === "users"
                  ? "bg-orange-300 text-black font-semibold"
                  : "hover:bg-orange-300 hover:text-black"
              }`}
              onClick={() => handleClick("users")}
            >
              Manage Users
            </p>
            <button
              className="text-xl hover:text-orange-300 transition"
              onClick={() => SetIsOpenUserSubTab(!isOpenUserSubTab)}
              aria-expanded={isOpenUserSubTab}
              aria-label="Toggle Manage Users"
            >
              {isOpenUserSubTab ? (
                <FontAwesomeIcon
                  icon={faSquareMinus}
                  style={{ color: "#FFD43B" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faSquarePlus}
                  style={{ color: "#FFD43B" }}
                />
              )}
            </button>
          </div>
          {isOpenUserSubTab && (
            <div className="mt-3 space-y-5 ml-5 text-lg w-[13vw]">
              <div
                className={`px-3 py-2 rounded-md cursor-pointer ${
                  currentTab === "users" && subTab === "view-users"
                    ? "bg-orange-300 text-black font-semibold"
                    : "hover:bg-orange-300 hover:text-black"
                }`}
                onClick={() => handleSetSubTab("view-users")}
              >
                View Users
              </div>
              <div
                className={`px-3 py-2 rounded-md cursor-pointer w-[13vw] ${
                  currentTab === "users" && subTab === "add-users"
                    ? "bg-orange-300 text-black font-semibold"
                    : "hover:bg-orange-300 hover:text-black"
                }`}
                onClick={() => handleSetSubTab("add-users")}
              >
                Add New User
              </div>
            </div>
          )}
        </li>

        <li className="hover:bg-orange-300 hover:text-black hover:font-semibold w-[18vw] p-3  text-xl rounded-md cursor-pointer">
          <p>App Settings</p>
        </li>
      </ul>
    </nav>
  );
};

export default AdminSidebar;
