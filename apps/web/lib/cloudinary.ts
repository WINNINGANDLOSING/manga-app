import cloudinary from "cloudinary";

export type SearchResult = {
  public_id: string;
};

export const fetchCloudinaryImages = async (): Promise<SearchResult[]> => {
  try {
    const results = (await cloudinary.v2.search
      .expression("resource_type:image")
      .sort_by("public_id", "asc")
      .max_results(50)
      .execute()) as { resources: SearchResult[] };

    return results.resources || [];
  } catch (error) {
    console.error("Error fetching images from Cloudinary:", error);
    return [];
  }
};
