"use client";
import React, { useState } from "react";
import axios from "axios";
import { CloundinaryImage } from "./cloudinary-image";

const UploadNewChapter = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) {
      alert("No files selected!");
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset
        formData.append("folder", "10010/Ch3"); // Specify the folder

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, // Replace with your Cloudinary cloud name
          formData
        );

        return response.data.secure_url; // Get the uploaded image URL
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setUploadedImages(uploadedUrls);
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center border-2 border-dashed p-5 relative rounded-md w-[5vw] h-[7vw] border-gray-300 cursor-pointer">
        <input
          id="images"
          type="file"
          multiple
          onChange={handleImageChange} // Handle image selection
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="text-center text-2xl text-gray-500 group-hover:text-indigo-600">
          <p>+</p>
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </button>

      <div className="flex flex-col mt-6 items-center">
        {uploadedImages.map((url, index) => (
          // <img
          //   key={index}
          //   src={url}
          //   alt={`Uploaded Image ${index + 1}`}
          //   className="w-full h-auto rounded-lg shadow-md"
          // />
          <CloundinaryImage
            key={index}
            width="960"
            height="600"
            src={url}
            alt="Chapter 1"
          />
        ))}
      </div>
    </div>
  );
};

export default UploadNewChapter;
