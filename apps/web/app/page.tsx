// import { MangaListTest } from "@/public/data/ExportedData";
import { getSession } from "@/lib/session";
import TrendingSection from "@/components/trending/page";
import LatestSection from "@/components/latestUpdates/page";
import TopSection from "@/components/TopRanking/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faFire, faCaretUp } from "@fortawesome/free-solid-svg-icons";

export default async function Home() {
  const session = await getSession();
  console.log({ session });

  /* 
  !!!!Important. To See role in this console log, 
  1. go to session.ts and include role in export const Session = in Create session function
  2. go to signin functions in auth.controller, and include role in the return object
  3. in the google/callback, add "&role=${response.role}" in the search query
  4. in the auth.ts, add role: result.role in the createSession
  5. go to google/callback/route.ts, add role in the createSession function

  */

  // bg-gray-200
  return (
    <div className="flex flex-col px-[11vw] h-screen bg-black ">
      <div className="mt-5 text-orange-500 text-2xl flex flex-col bg-black h-screen rounded-sm px-5 py-3">
        <div className="mb-6 flex flex-col h-fit">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faFire} style={{ color: "#f97316" }} />

            <h1 className="font-bold">TRENDING</h1>
          </div>
          <TrendingSection />
        </div>
        <div className="flex gap-5 w-full">
          <div className="mb-6 flex flex-col">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faClockRotateLeft}
                style={{ color: "#f97316" }}
              />
              <h1 className="font-bold">LATEST UPDATES</h1>
            </div>
            <LatestSection />
          </div>
          <div className="mt-10">
            <TopSection />
          </div>
        </div>
        <div>
          <h1>GENRES</h1>
        </div>
      </div>
    </div>
  );
}
