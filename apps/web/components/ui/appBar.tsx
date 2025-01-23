import React from "react";
import Link from "next/link";
import SignInButton from "./signButton";
import { Input } from "./input";
const AppBar = () => {
  return (
    <div className="py-3 shadow flex gap-10 bg-gradient-to-br px-44 text-2xl from-orange-400 to-orange-600 text-white">
      <Link
        className=" text-gray-200 hover:text-white hover:underline decoration-white font-bold transition-all"
        href={"/"}
      >
        Home
      </Link>

      <Link
        className=" text-gray-200 hover:text-white hover:underline decoration-white font-bold transition-all"
        href={"/"}
      >
        Browse
      </Link>

      <Link
        className=" text-gray-200 hover:text-white hover:underline decoration-white font-bold transition-all"
        href={"/about"}
      >
        Your Favorites
      </Link>

      <Link
        className=" text-gray-200 hover:text-white hover:underline decoration-white font-bold transition-all"
        href={"/admin-interface"}
      >
        Admin Interface
      </Link>

      <Input
        placeholder="Search..."
        className="ml-auto w-fit bg-white text-black"
      />

      <SignInButton />
    </div>
  );
};
export default AppBar;
