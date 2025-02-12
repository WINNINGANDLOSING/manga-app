"use client";

import { getAllCreators, getCreatorsById } from "@/lib/actions";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [authors, setAuthors] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const manga_id = 10009;

  useEffect(() => {
    const fetchingCreators = async () => {
      const data = await getAllCreators();
      const formatted_data = data.sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );
      setAuthors(formatted_data);
    };
    fetchingCreators();
  }, []);

  // useEffect(() => {
  //   if (authors && authors !== null) {
  //     authors.forEach((author) => {
  //       console.log(`Name: ${author.creators.name}, Role: ${author.role}`);
  //     });
  //   }

  //   if (artists && artists !== null) {
  //     artists.forEach((artist) => {
  //       console.log(`Name: ${artist.creators.name}, Role: ${artist.role}`);
  //     });
  //   }
  // }, [authors, artists]);

  useEffect(() => {
    if (authors && authors !== null) {
      console.log(authors);
    }
  }, [authors]);

  return <div className="bg-black h-screen"></div>;
};

export default Page;
