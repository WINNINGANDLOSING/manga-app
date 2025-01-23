"use client"; // Enables React's Client Components functionality
import React, { useEffect, useState } from "react";
import { CloundinaryImage } from "./cloudinary-image"; // Custom component for rendering Cloudinary images

// Type definition for a search result from Cloudinary
type SearchResult = {
  public_id: string; // Unique identifier for the image in Cloudinary
};

// Main component for rendering manga chapter pages
const Page = ({
  searchParams,
}: {
  searchParams: {
    manga_id: number; // Manga ID passed via URL query params
    chapter_id: number; // Chapter ID passed via URL query params
  };
}) => {
  const chapter_id = searchParams.chapter_id; // Extract chapter ID from query params
  const manga_id = searchParams.manga_id; // Extract manga ID from query params
  const [pages, setPages] = useState<{ resources: SearchResult[] } | null>(
    null
  ); // State to store chapter pages data
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  // Fetch chapter pages using the API path in Next.js
  useEffect(() => {
    const getPanels = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/cloudinary/fetchChapterPages", // API endpoint to fetch chapter images
          {
            method: "POST", // Using POST to send data
            headers: {
              "Content-Type": "application/json", // Specify content type
            },
            body: JSON.stringify({ manga_id, chapter_id }), // Send manga ID and chapter ID as payload
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch images"); // Handle errors for failed requests
        }

        const data = await response.json(); // Parse response JSON
        setPages(data?.data || []); // Store the fetched images in the state
      } catch (error) {
        console.error("Error fetching images:", error); // Log errors for debugging
      } finally {
        setIsLoading(false); // Set loading state to false once data is fetched or error occurs
      }
    };

    getPanels(); // Trigger the API call
  }, [manga_id, chapter_id]); // Dependencies: re-run when manga_id or chapter_id changes

  // Log fetched pages whenever they are updated (useful for debugging)

  return (
    <div className="px-20 default-style">
      {/* Render loading indicator while data is being fetched */}
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <ul className="flex flex-col items-center">
          {/* Render list of chapter pages */}
          {pages?.resources?.map((res: any) => (
            <CloundinaryImage
              key={res.public_id} // Unique key for each image
              width="1000" // Fixed image width
              height="700" // Fixed image height
              src={res.public_id} // Source URL of the image
              alt={`Chapter ${chapter_id}`} // Descriptive alt text for accessibility
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
