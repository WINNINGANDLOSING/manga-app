"use client";
import { getSession } from "@/lib/session";
import { redirect, useRouter } from "next/navigation";
import { Role } from "@/lib/type";
import CreateMangaModal from "@/components/createNewManga/page";
import AdminSidebar from "@/components/sidebar/page";
import React, { useEffect, useState } from "react";
import { getAllManga, getAllTags, getAllUsers } from "@/lib/actions";

const AdminPage = () => {
  const router = useRouter();
  //const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // Track authorization state

  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       const session = await getSession();
        
  //       // Redirect if no session or the user is not an admin
  //       if (!session || !session.user || session?.user.role === "USER") {
  //         router.push("/publicPage");
  //       }

  //       // Mark user as authorized
  //       //setIsAuthorized(true);
  //     } catch (error) {
  //       console.error("Error during session check:", error);
  //       router.push("/");
  //     }
  //   };

  //   checkSession();
  // }, [router]);

  // if (isAuthorized === null) {
  //   // Render nothing until authorization state is resolved
  //   <div>Checking for authorization</div>
  //   return null;
  // }

  const [mangas, setAllMangas] = useState<any[]>([]);
  const [users, setAllUsers] = useState<any[]>([]);
  

  // wont work useState<>() because mangas.length is undefined
  const [currentTab, setCurrentTab] = useState("mangas");
  const [currentPage, setCurrentPage] = useState({
    mangas: 1,
    users: 1,
  });

  // Create new manga modal
  const [isOpen, SetIsOpen] = useState(false);

  const dataPerPage = 6;
  const lastMangaIndex = dataPerPage * currentPage["mangas"];
  const firstMangaIndex = lastMangaIndex - dataPerPage;
  const lastUserIndex = dataPerPage * currentPage["users"];
  const firstUserIndex = lastUserIndex - dataPerPage;

  const totalPagesManga = Math.ceil(mangas.length / dataPerPage);
  const totalPagesUsers = Math.ceil(users.length / dataPerPage);

  const handleNext = (sectionType: "mangas" | "users") => {
    const totalPages =
      sectionType === "mangas" ? totalPagesManga : totalPagesUsers;
    if (currentPage[sectionType] < totalPages) {
      setCurrentPage((prevState) => ({
        ...prevState,
        [sectionType]: prevState[sectionType] + 1,
      }));
    }
  };

  const handlePrevious = (sectionType: "mangas" | "users") => {
    if (currentPage[sectionType] > 1) {
      setCurrentPage((prevState) => ({
        ...prevState,
        [sectionType]: prevState[sectionType] - 1,
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mangaData, userData, tagData] = await Promise.all([
          getAllManga(),
          getAllUsers(),
          getAllTags(),
        ]);
        setAllMangas(mangaData);
        setAllUsers(userData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  

  const paginatedMangas = mangas.slice(firstMangaIndex, lastMangaIndex);
  const paginatedUsers = users.slice(firstUserIndex, lastUserIndex);
  const setTab = (tabName: string) => {
    setCurrentTab(tabName);
  };
  const refreshPage = () => {
    window.location.reload();
  };

  /* 
  Sidebar properties and actions
  */

  const [currentSubTab, setCurrentSubTab] = useState("add-mangas");

  return (
    <div className="min-h-screen text-white  p-5 bg-black">
      {/* Header */}
      <header className="flex items-center  bg-gray-800 text-center justify-center shadow-md p-5 rounded-md">
        <h1 className="text-3xl font-bold text-orange-600 ">Admin Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="flex gap-5 mt-5">
        {/* Sidebar */}

        <AdminSidebar
          currentTab={currentTab}
          setTab={setTab}
          subTab={currentSubTab}
          setSubTab={setCurrentSubTab}
        />

        {/* Main Panel */}
        <section className="w-3/4 col-span-3 bg-gray-800 shadow-md p-5 text-wh rounded-md">
          {/*Dashboard (default tab)*/}
          {currentTab === "dashboard" && (
            <div className="grid grid-cols-3 gap-5 mb-5">
              <div className="bg-blue-100 p-5 rounded-md shadow-md text-center">
                <h2 className="text-2xl font-bold text-blue-600">
                  {mangas ? mangas.length : 0}
                </h2>
                <p className="text-lg text-blue-700">Total Mangas</p>
              </div>
              <div className="bg-green-100 p-5 rounded-md shadow-md text-center">
                <h2 className="text-2xl font-bold text-green-600">
                  {mangas
                    ? mangas.filter((manga) => manga.status === "Completed")
                        .length
                    : 0}
                </h2>
                <p className="text-lg text-green-700">Completed Mangas</p>
              </div>
              <div className="bg-yellow-100 p-5 rounded-md flex flex-col shadow-md text-center">
                <h2 className="text-2xl font-bold text-yellow-600">
                  {mangas
                    ? mangas.filter((manga) => manga.status === "Ongoing")
                        .length
                    : 0}{" "}
                </h2>
                <p className="text-lg text-yellow-700">Ongoing Mangas</p>
              </div>
            </div>
          )}

          {/* Manga Section */}
          {/* View Mangas */}
          {currentTab === "mangas" && currentSubTab === "view-mangas" && (
            <div>
              <div className="flex justify-center  mb-5">
                <h2 className="text-2xl font-semibold">Manage Mangas</h2>
              </div>
              {/* Manga Table */}
              <table className="w-full border-collapse ">
                <thead>
                  <tr className=" text-left">
                    <th className="p-3 w-1/12" style={{ width: "5%" }}>
                      #
                    </th>
                    <th className="p-3 w-2/5" style={{ width: "40%" }}>
                      Title
                    </th>
                    <th className="p-3 w-1/6" style={{ width: "15%" }}>
                      Status
                    </th>
                    <th className="p-3 w-1/2" style={{ width: "25%" }}>
                      Genres
                    </th>
                    <th className="p-3 w-1/3 " style={{ width: "15%" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* <tr className="odd:bg-gray-100 hover:bg-gray-200">
                    <td className="p-3">1</td>
                    <td className="p-3">One Piece</td>
                    <td className="p-3 text-green-500 font-semibold">
                      Ongoing
                    </td>
                    <td className="p-3">Action, Adventure</td>
                    <td className="p-3 space-x-3">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  </tr> */}
                  {paginatedMangas.length > 0 &&
                    paginatedMangas !== null &&
                    paginatedMangas.map((manga: any, index: any) => (
                      <tr
                        className="bg-gray-800 hover:bg-gray-200 hover:text-black"
                        key={index}
                      >
                        <td>
                          {(currentPage["mangas"] - 1) * dataPerPage +
                            index +
                            1}
                        </td>
                        <td className="font-semibold">{manga.title}</td>
                        <td
                          className={`${manga.status === "Ongoing" ? "text-green-400" : manga.status === "Completed" ? "text-blue-400" : "text-orange-300"} uppercase font-semibold`}
                        >
                          {manga.status}
                        </td>
                        <td>{manga.genres.join(", ") || "Not Specified"}</td>
                        <td className="p-3 space-x-3">
                          <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                            Edit
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-center space-x-5 items-center mt-5">
                <button
                  onClick={() => handlePrevious("mangas")}
                  disabled={currentPage["mangas"] === 1}
                  className={`px-4 py-2 rounded-md w-[5vw] ${
                    currentPage["mangas"] === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <p>
                  Page {currentPage["mangas"]} of {totalPagesManga}
                </p>
                <button
                  onClick={() => handleNext("mangas")}
                  disabled={currentPage["mangas"] === totalPagesManga}
                  className={`px-4 py-2 rounded-md w-[5vw] ${
                    currentPage["mangas"] === totalPagesManga
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Add New Manga */}
          {currentTab === "mangas" && currentSubTab === "add-mangas" && (
            <CreateMangaModal />
          )}

          {/* Users Section (To be added)*/}
          {currentTab === "users" && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-semibold">Manage Users</h2>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
                  onClick={() => SetIsOpen(true)}
                >
                  Add Users
                </button>
              </div>
              {/* Manga Table */}
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="p-3 w-1/12 text-left">#</th>
                    <th className="p-3 w-1/12 text-left ">ID</th>
                    <th className="p-3 w-1/3 text-left">Name</th>
                    <th className="p-3 w-1/2 text-left ">Email</th>
                    <th className="p-3 w-1/3 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length > 0 &&
                    paginatedUsers.map((user: any, index: any) => (
                      <tr
                        className="bg-gray-800 text-white hover:bg-gray-200 hover:text-black"
                        key={index}
                      >
                        <td className="p-3 text-left">
                          {(currentPage["users"] - 1) * dataPerPage + index + 1}
                        </td>
                        <td className="p-3 font-semibold">{user.id}</td>
                        <td className="p-3 font-semibold">{user.name}</td>
                        <td className="p-3 font-semibold">{user.email}</td>
                        <td className="p-3 font-semibold">{user.role}</td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-center space-x-5 items-center mt-5">
                <button
                  onClick={() => handlePrevious("users")}
                  disabled={currentPage["users"] === 1}
                  className={`px-4 py-2 rounded-md w-[5vw] ${
                    currentPage["users"] === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <p>
                  Page {currentPage["users"]} of {totalPagesUsers}
                </p>
                <button
                  onClick={() => handleNext("users")}
                  disabled={currentPage["users"] === totalPagesUsers}
                  className={`px-4 py-2 rounded-md w-[5vw] ${
                    currentPage["users"] === totalPagesUsers
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPage;

/* 
Old Codes

*/
