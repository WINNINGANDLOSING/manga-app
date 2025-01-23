import React, { useEffect, useState } from "react";
import { CloundinaryImage } from "./cloudinary-image";
import { fetchCloudinaryImages, SearchResult } from "@/lib/cloudinary";

export default function Page() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await fetchCloudinaryImages();
        setResults(images);
      } catch (err) {
        console.error("Error loading images:", err);
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section>
      <h1>Page with Cloudinary Images</h1>
      <div className="flex flex-col">
        {results.map((res) => (
          <CloundinaryImage
            key={res.public_id}
            width="960"
            height="600"
            src={res.public_id}
            alt="Chapter Image"
          />
        ))}
      </div>
    </section>
  );
}
