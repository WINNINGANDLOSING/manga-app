"use client";

import { getAllCreators, getCreatorsById } from "@/lib/actions";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [authors, setAuthors] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const manga_id = 10009;

  useEffect(() => {
    const fetchingCreator = async () => {
      const data = await getAllCreators();
      // const { authors, artists } = data;
      setAuthors(data);
      // setArtists(artists.map((artist: any) => artist.creators.name));
    };
    fetchingCreator();
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
