"use client";
import { CldImage } from "next-cloudinary";
import fs from "fs";

import cloudinary from "cloudinary";
import { CloundinaryImage } from "./cloudinary-image"
import { useEffect, useState } from "react";
// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
type SearchResult = {
  public_id: string;
};
const Page = () => {
  const manga_id = 10010;
  const [backgroundCover, setBackgroundCover] = useState<any>(null);

  useEffect(() => {
    const getBackgroundCover = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/cloudinary/fetchBgCover",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ manga_id }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setBackgroundCover(data?.data || []);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    getBackgroundCover();
  }, [manga_id]);

  // useEffect(() => {
  //   if (backgroundCover) {
  //     console.log(backgroundCover);
  //   }
  // }, [backgroundCover]);
  // Convert results to a formatted JSON string
  // const formattedResults = JSON.stringify(results, null, 2);
  // Extract URLs into a list
  // const urls = results.resources.map(
  //   (res) =>
  //     `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${res.public_id}`
  // );
  // Write the URLs to a separate file
  // fs.writeFileSync(
  //   "cloudinary_urls.txt",
  //   JSON.stringify(urls, null, 2),
  //   "utf8"
  // );

  // // Write the formatted results to a text file
  // fs.writeFileSync("cloudinary_results.txt", formattedResults, "utf8");

  return (
    <section>
      <div className="flex items-center justify-center">
        <h1>Words</h1>
        <div className="flex flex-col ">
          <img src={backgroundCover} />
        </div>
      </div>
    </section>
  );
};

export default Page;
