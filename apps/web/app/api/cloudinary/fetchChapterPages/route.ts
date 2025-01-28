import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

type SearchResult = {
  public_id: string;
};
export async function POST(req: NextRequest, res: NextApiResponse) {
  const body = await req.json(); // req.body;
  // body: JSON.stringify({ manga_id, chapter_id }),

  const { manga_id, chapter_id } = body;

  try {
    const results = await cloudinary.v2.search
      .expression(`folder:${manga_id}/Ch${chapter_id} AND resource_type:image`)
      .sort_by("display_name", "asc")
      .max_results(200)
      .execute();
    // .max_results(50)

    // res.status(200).json(results.resources);

    // return new Response("OK", { status: data });

    return NextResponse.json({ data: results }, { status: 201 });
  } catch (error) {
    console.error("Error fetching Cloudinary data:", error);
    res.status(500).json({ error: "Failed to fetch data from Cloudinary." });
  }
  //   } else {
  //     res.status(405).json({ error: "Method not allowed." });
  //   }
}
