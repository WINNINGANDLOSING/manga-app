"use client";
import React, { useState } from "react";
import axios from "axios";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const manga_id = 10009; // Manga ID (this could come from props or dynamic routing)
  const chapter_number = 8; // Chapter number (this would be passed from the client or form)
  // const chapter_name = "END"; // Chapter name (optional, depending on your schema)

  const createNewChapter = async () => {
    setLoading(true);
    setError(null); // Reset any previous errors
    try {
      console.log(chapter_number)
      // Send a POST request to your NestJS API
      const query = await fetch(
        `http://localhost:7000/manga/createNewChapter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set Content-Type to application/json
          },
          body: JSON.stringify({
            mangaId: manga_id,
            chapterNumber: chapter_number,
          }),
        }
      );
      // if (!query.ok) {
      //   throw new Error("Failed to create chapter");
      // }
      // const response = await query.json();
      const response = await query.json(); // remember to set await here
      setSuccess(true); // Successful response handling
      console.log("Chapter Created Successfully:", response);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h1>Create a New Chapter</h1>
      <button
        onClick={createNewChapter}
        disabled={loading} // Disable button while loading
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Chapter"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500">Chapter Created Successfully!</p>
      )}
    </div>
  );
};

export default Page;
