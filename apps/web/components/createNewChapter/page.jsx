import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { CLOUDINARY_CLOUD_NAME } from "@/lib/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { addNewChapter } from "@/lib/actions";
import { authFetch } from "@/lib/authFetch";
import PanelPreview from "./PanelPreview";

const CreateChapterModal = ({ setIsOpen, mangaInfo, onSuccess }) => {
  // uploading to cloudinary
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const router = useRouter();

  // uploading to db
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const mangaTitle = mangaInfo?.title;
  const manga_id = mangaInfo?.id;
  // The reason is that Math.max requires individual numbers as arguments, not an array
  // Not using spread operator would return the array
  // spread operator unpacks that array into individual arguments to find the maximum value
  const latestChapter = mangaInfo?.chapters?.length
    ? Math.max(...mangaInfo.chapters.map((chapter) => chapter.chapter_number))
    : 0;

  const handleImageChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  // Function to handle inserting data to both postgres db (insert new record into the table 'chapter')
  // and uploading related manga panels for that chapter to cloudinary
  // upload the manga images first then the data records into postgreqs
  const handleUpload = async () => {
    if (!selectedFiles) {
      alert("No chapter panels uploaded!");
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset
        formData.append("folder", `${manga_id}/Ch${latestChapter + 1}`); // Specify the folder

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, // Replace with your Cloudinary cloud name
          formData
        );

        return response.data.secure_url; // Get the uploaded image URL
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setUploadedImages(uploadedUrls);
      alert("Images uploaded successfully!");
      await handleUploadDb();
      alert("Images uploaded and chapter created successfully!");
      setIsOpen(false);
      onSuccess(); // This will reload the current route
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  // Function to handle uploading new chapter data to database
  const handleUploadDb = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await addNewChapter(manga_id, latestChapter);
      setSuccess(true);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };
  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      cancelAction();
    }
  };

  const cancelAction = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel uploading a new chapter ?"
      )
    )
      setIsOpen(false);
  };

  // Opening chapter panels for preview before uploading
  const [isOpenPanelsPreview, setIsOpenPanelsPreview] = useState(false);

  const handleSetIsOpenPanelsPreview = () => {
    if (selectedFiles !== null) {
      setIsOpenPanelsPreview(true);
    }
  };
  return (
    <div
      className="inset-0 flex items-center justify-center bg-black shadow-lg text-white fixed z-40 bg-opacity-50"
      onClick={closeModal} // Detect outside clicks
    >
      <form
        className="bg-black bg-opacity-90 space-y-3 px-5 py-3 rounded-lg w-full max-w-[50vw] shadow-lg"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default submission
          if (document.getElementById("chapter-number").value === "") {
            return;
          }
          handleUpload(); // Your custom upload logic
        }}
      >
        <p className="text-2xl font-semibold mb-5">Upload Chapter</p>
        <div className="flex flex-col border-b-gray-400 border-b-[1px] pb-5">
          <p className="font-mono font-semibold">Manga Details</p>
          <div className="flex space-x-3 mt-2 bg-gray-900 rounded-lg p-1">
            <img
              src={mangaInfo.cover_image_url}
              alt="cover"
              className="w-[3vw] h-[4vw] rounded-lg"
            />
            <div className="flex flex-col text-sm">
              <p className="font-semibold text-base">{mangaTitle}</p>
              <p>{mangaInfo.authors}</p>
              <p
                className={`${mangaInfo.status === "Ongoing" ? "text-green-400" : mangaInfo.status === "Completed" ? "text-blue-400" : "text-orange-300"} uppercase font-semibold`}
              >
                {mangaInfo.status}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col border-b-gray-400 border-b-[1px] pb-5">
          <p className="font-mono font-semibold">
            Chapter Details (Latest Chapter:&nbsp;
            <span className="font-bold text-base text-orange-500">
              {latestChapter}
            </span>
            )
          </p>
          <div className="flex mt-2 flex-col space-y-3 p-1 ">
            <div className="flex space-x-3">
              <input
                placeholder="Chapter Number"
                type="number"
                name="chapter-number"
                id="chapter-number"
                className="bg-gray-900 border-0 appearance-none w-full outline-none rounded-sm p-2"
                min={latestChapter + 1} // dynamic or JavaScript value must be enclosed in curly braces
                required
                // onChange={(e) => {
                //   const value = parseInt(e.target.value, 10);
                //   if (value < latestChapter + 1) {
                //     e.target.value = latestChapter + 1; // Reset to the minimum value
                //   }
                // }}
              />
              <input
                placeholder="Volume Number (optional)"
                type="number"
                name="volume-number"
                id="volume-number"
                className="bg-gray-900 border-0 appearance-none w-full outline-none rounded-sm p-2"
              />
            </div>
            <input
              placeholder="Chapter Title (Optional)"
              className="bg-gray-900 border-0 appearance-none w-full outline-none rounded-sm p-2"
              name="chapter-title"
              id="chapter-title"
            />
          </div>
        </div>
        <div className="flex flex-col border-b-gray-400 border-b-[1px] space-y-2 pb-5">
          <div className="flex space-x-3">
            <p className="font-mono font-semibold">
              Uploading Pages (
              {selectedFiles === null
                ? "No page uploaded"
                : `${selectedFiles.length} pages uploaded`}
              ){/* {selectedFiles.length === 1 ? "page" : "pages"} */}
            </p>
            {selectedFiles && (
              <button
                className="bg-gray-400 px-2 rounded-sm text-sm hover:scale-105"
                onClick={() => setSelectedFiles(null)}
                type="button"
              >
                Undo
              </button>
            )}
          </div>

          {selectedFiles === null ? (
            <div className="flex items-center justify-center w-[5vw] h-[7vw] border-2 mt-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer relative">
              <input
                id="images"
                type="file"
                multiple
                onChange={handleImageChange}
                //onChange={handleImageChange} // Handle image selection
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center text-2xl text-gray-500 group-hover:text-indigo-600">
                <p>+</p>
              </div>
            </div>
          ) : (
            <div className="">
              <p
                className=" hover:text-blue-400 w-fit hover:cursor-pointer text-lg"
                onClick={() => handleSetIsOpenPanelsPreview()}
              >
                See preview
              </p>
              {isOpenPanelsPreview && (
                <PanelPreview
                  panels={selectedFiles}
                  setIsOpen={setIsOpenPanelsPreview}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center rounded-lg shadow-md">
          <button
            className="bg-gray-300 text-gray-800 px-12 py-2 rounded-md hover:bg-gray-400 transition-colors hover:font-semibold"
            onClick={cancelAction}
            type="button"
          >
            Cancel
          </button>
          <button
            className="bg-orange-500 text-white px-12 py-2 rounded-md hover:bg-orange-600 hover:font-semibold transition-colors"
            // onClick={handleUpload}
            disabled={uploading}
            type="submit"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateChapterModal;
