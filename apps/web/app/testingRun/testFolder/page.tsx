import { CldImage } from "next-cloudinary";
import fs from "fs";

import cloudinary from "cloudinary";
import { CloundinaryImage } from "./cloudinary-image";
// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
type SearchResult = {
  public_id: string;
};
export default async function Page() {
  const results = (await cloudinary.v2.search
    .expression("folder:10010/Ch2 AND resource_type:image")
    .sort_by("display_name", "asc")
    .max_results(70)
    .execute()) as { resources: SearchResult[] };


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

  console.log(results);
  return (
    <section>
      <div className="flex items-center justify-center">
        <h1>Words</h1>
        <div className="flex flex-col ">
          {results.resources.map((res) => (
            <CloundinaryImage
              key={res.public_id}
              width="960"
              height="600"
              src={res.public_id}
              alt="Chapter 1"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
