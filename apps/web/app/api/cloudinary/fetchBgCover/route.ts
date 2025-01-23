import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
type SearchResult = {
  public_id: string;
};

export async function POST(req: NextRequest, res: NextApiResponse) {
  const body = await req.json(); // req.body;
  const { manga_id } = body;
 
  try {
    const result = await cloudinary.v2.search
      .expression(`folder:${manga_id}/bg_cover AND resource_type:image`)
      .max_results(2)
      .execute();

    // res.status(200).json(results.resources);

    // return new Response("OK", { status: data });

    const bg_cover_url = result.resources.map((res: any) => res.secure_url);
    return NextResponse.json({ data: bg_cover_url }, { status: 201 });
  } catch (error) {
    console.error("Error fetching background cover:", error);
    res.status(500).json({ error: "Failed to fetch data from Cloudinary." });
  }
  //   } else {
  //     res.status(405).json({ error: "Method not allowed." });
  //   }
}
