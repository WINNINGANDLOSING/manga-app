"use client";

import {
  getAllCreators,
  getAllTags,
  getCreatorsById,
  getTagsById,
} from "@/lib/actions";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [allTags, setAllTags] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  // const [artists, setArtists] = useState<any[]>([]);
  const manga_id = 10001;

  useEffect(() => {
    const fetchingTags = async () => {
      const data = await getTagsById(manga_id);
      // const { authors, artists } = data;
      setAllTags(data);
      // setThemes(
      //   data
      //     .filter((tag: any) => tag.tags?.tag_type === "themes")
      //     .map((tag: any) => tag.tags?.name)
      // );
      // setArtists(artists.map((artist: any) => artist.creators.name));
    };
    fetchingTags();
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
    if (allTags && allTags.length > 0) {
      const filteredThemes = allTags.filter(
        (tag) => tag.tags?.tag_type === "themes"
      );

      setThemes(filteredThemes);
    }
  }, [allTags]);

  useEffect(() => {
    if (themes && themes !== null) {
      themes.map((theme) => {
        console.log(theme.tags.name);
      });
    }
  }, [themes]);

  return <div className="bg-black h-screen"></div>;
};

export default Page;
