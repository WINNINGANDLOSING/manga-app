"use client";
import { use, useEffect, useState } from "react";
import { editManga, getMangaById } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CreateNewAlternativeTitlesModal from "@/components/createNewManga/CreateNewAlternativeTitles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faMinus } from "@fortawesome/free-solid-svg-icons";
import CreateNewSynopsisModal from "@/components/createNewManga/CreateNewSynopsisModal";
import AddNewTagsModal from "./addNewTagsModal";
import AddNewCreatorsModal from "./addNewCreatorsModal";
import axios from "axios";

interface AlternativeTitle {
  flag: string;
  content: string;
}

interface Tag {
  id: number;
  name: string;
  tag_type: string;
}

interface MangaTag {
  id: number;
  tags: Tag;
}

interface Creator {
  id: number;
  name: string;
}

interface Creator1 {
  name: any;
  role: any;
}

interface MangaCreator {
  id: number;
  role: string;
  creators: Creator;
}

interface Manga {
  id: number;
  title: string;
  original_lan: string;
  description: string;
  cover_image_url: string;
  status: string;
  release_year: number;
  content_rating: string;
  alternative_titles: AlternativeTitle[];
  manga_tag: MangaTag[];
  manga_creator: MangaCreator[];
}

interface Creator {
  type: "Author" | "Artist";
  name: string;
}

const EditMangaPage = ({
  searchParams,
}: {
  searchParams: { manga_id: string };
}) => {
  const [title, setTitle] = useState<string | undefined>("");
  const [originalLan, setOriginalLan] = useState<string | undefined>("");
  useEffect(() => {
    console.log("titles", title);
  }, [title]);
  const [altTitles, setAltTitles] = useState<AlternativeTitle[]>([]);
  useEffect(() => {
    console.log("altTitles", altTitles);
  }, [altTitles]);
  const [altTitlesTemp, setAltTitlesTempp] = useState<string[]>([]);
  const [isOpenModalTitles, setIsOpenModalTitles] = useState(false);

  useEffect(() => {
    if (altTitlesTemp && altTitlesTemp.length > 0) {
      const newAltTitles = altTitlesTemp.map((title: any) => ({
        flag: title.flag,
        content: title.content,
      }));
      setAltTitles((prevState: any) => {
        return [...(prevState || []), ...newAltTitles];
      });
    }
  }, [altTitlesTemp]);

  const handleOnDelAltTiles = (title: any) => {
    if (
      window.confirm(
        `Are you sure you want to remove title: ${title.content}. \nThere is no undo option.`
      )
    ) {
      setAltTitles((prevState: any) => {
        return prevState.filter(
          (existingTitle: any) => existingTitle !== title
        );
      });
    }
  };
  const [des, setDes] = useState<string>("");
  const [isOpenModalSynopsis, setIsOpenModalSynopsis] = useState(false);
  const [bgCover, setBgCover] = useState<string | undefined>(undefined);
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    setBgCover(file);
  };
  const [status, setStatus] = useState<string>("");
  const [releaseYear, setReleaseYear] = useState<number>();
  const [contentRating, setContentRating] = useState<string>("Safe");
  const [tags, setTags] = useState<string[]>([]);
  const [altTagsTemp, setAltTagsTempp] = useState<string[]>([]);
  // Deleting tags function
  const handleOnDelTags = (tag: any) => {
    if (window.confirm(`Confirm deleting tag '${tag}'`)) {
      setTags((prev: any) =>
        prev.filter((existingTag: any) => existingTag !== tag)
      );
    }
  };

  // const confirmDelTags = (tag: any) => {
  //   setTags((prev: any) =>
  //     prev.filter((existingTag: any) => existingTag !== tag)
  //   );
  // };

  useEffect(() => {
    const handleSetTags = (tag: any) => {
      setTags((prev: any) => {
        if (!prev.some((existingTag: string) => existingTag === tag)) {
          return [...prev, tag];
        }
        return prev;
      });
    };
    console.log("alt tags", altTagsTemp);
    if (altTagsTemp.length > 0) {
      altTagsTemp.map((altTag: any) => {
        if (altTag !== "") {
          handleSetTags(altTag);
        }
      });
    }
  }, [altTagsTemp]);

  const [isOpenModalTags, setIsOpenModalTags] = useState(false);

  const [creators, setCreators] = useState<
    | {
        name: any;
        role: any;
      }[]
    | null
  >([]);
  const [altTagsCreator, setAltTagsCreator] = useState<string[]>([]);
  useEffect(() => {
    
    Object.entries(altTagsCreator).forEach(([key, value]) => {
      if (key === "artists" && Array.isArray(value)) {
        setCreators((prev: any) => {
          const newArtists = value
            .filter(
              (artist: any) =>
                !prev.some(
                  (existing: any) =>
                    existing.name === artist.name && existing.role === "artist"
                )
            )
            .map((artist: any) => ({
              name: artist.name,
              role: "artist",
            }));

          return [...prev, ...newArtists];
        });

        /* */
      } 
      
      
      else if (key === "authors" && Array.isArray(value)) {
        setCreators((prev: any) => {
          const newAuthors = value
            .filter(
              (author: any) =>
                !prev.some(
                  (existing: any) =>
                    existing.name === author.name && existing.role === "author"
                )
            )
            .map((author: any) => ({
              name: author.name,
              role: "author",
            }));

          return [...prev, ...newAuthors];
        });

      }
      console.log(key);
      console.log(value);
    });
  }, [altTagsCreator]);

  const [isOpenModalCreators, setIsOpenModalCreators] = useState(false);

  const handleOnDelCreators = (creator: any) => {
    if (
      window.confirm(
        `Are you sure you want to remove creator: \nName: ${creator.name}\nRole: ${creator.role}\nThere is no undo option.`
      )
    ) {
      setCreators((prevState: any) => {
        return prevState.filter(
          (existingCreator: any) => existingCreator !== creator
        );
      });
    }
  };

  const manga_id = searchParams.manga_id;

  // useEffect(() => {
  //   console.log("titles", title);
  // }, [title]);

  // useEffect(() => {
  //   console.log("covewr image", bgCover);
  // }, [bgCover]);

  // useEffect(() => {
  //   console.log("description", des);
  // }, [des]);

  // useEffect(() => {
  //   console.log("cover image", bgCover);
  // }, [bgCover]);

  // useEffect(() => {
  //   console.log("status", status);
  // }, [status]);

  // useEffect(() => {
  //   console.log("release year", releaseYear);
  // }, [releaseYear]);

  // useEffect(() => {
  //   console.log("content rating", contentRating);
  // }, [contentRating]);

  useEffect(() => {
    console.log("tags", tags);
  }, [tags]);

  useEffect(() => {
    console.log("creators", creators);
    creators?.map((creator: any) => {
      console.log(creator.name, creator.role);
    });
  }, [creators]);

  const [manga, setManga] = useState<Manga | null>(null);

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const refreshPage = () => {
    window.location.reload();
  };
  useEffect(() => {
    const fetchManga = async () => {
      if (!manga_id) return;
      const mangaData = await getMangaById(manga_id);
      setManga(mangaData);
      setLoading(false);
    };
    fetchManga();
  }, [manga_id]);

  useEffect(() => {
    setTitle(manga?.title);
    setOriginalLan(manga?.original_lan);
    setAltTitles(manga?.alternative_titles?.map((t) => t) || []);
    setDes(manga?.description || "");
    setBgCover(manga?.cover_image_url || undefined);
    setStatus(manga?.status || "");
    setReleaseYear(manga?.release_year);
    setContentRating(manga?.content_rating || "Safe");
    setTags(manga?.manga_tag?.map((t) => t.tags.name) || []);
    setCreators(
      manga?.manga_creator
        ? manga.manga_creator.map(({ role, creators }) => ({
            name: creators.name,
            role,
          }))
        : null
    );
  }, [manga]);

  const handleOnClose = (type: string) => {
    if (type === "altT") {
      setIsOpenModalTitles(false);
    } else if (type === "synopsis") {
      setIsOpenModalSynopsis(false);
    }
  };

  const handleAddingCoverImage = async (image: any) => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "ml_default");
      const folderName = `${manga_id}/bg_cover`;
      formData.append("folder", folderName);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, // Replace with your Cloudinary cloud name
        formData
      );
      const uploadedImageUrl = response.data.secure_url;
      console.log("Image uploaded successfully:", uploadedImageUrl);
      return uploadedImageUrl;
    } catch (err) {
      console.log("ERROR UPLOADING IMAGE TO CLOUDINARY");
      return "BLANK";
    }
  };
  const handleEditingManga = async (
    manga_id: string,
    title: string,
    alternative_titles: AlternativeTitle[],
    description: string,
    creators: Creator1[],
    originalLanguage: string | undefined,
    releaseYear: number,
    content_rating: string,
    tags: string[],
    cover_image_url: string,
    status: string
  ) => {
    // setError(null);
    try {
      const response = await editManga(
        manga_id,
        title,
        alternative_titles,
        description,
        creators,
        originalLanguage,
        releaseYear,
        content_rating,
        tags,
        cover_image_url,
        status
      );
      setUpdateLoading(true);
      setSuccess(true);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Submitting Logic
  const handleSubmit = async () => {
    const conditionsChecking =
      title &&
      title !== "" &&
      bgCover &&
      bgCover !== undefined &&
      des &&
      des !== "" &&
      releaseYear &&
      releaseYear > 1600 &&
      releaseYear < new Date().getFullYear() &&
      tags &&
      tags.length > 0 &&
      creators &&
      creators.filter((creator: any) => creator.role === "author").length > 0 &&
      creators.filter((creator: any) => creator.role === "artist").length > 0;

    if (!conditionsChecking) {
      window.alert("Missing Fields Or Info.");
    } else {
      setUpdateLoading(true);
      const bg_url = await handleAddingCoverImage(bgCover);
      await handleEditingManga(
        manga_id,
        title,
        altTitles,
        des,
        creators,
        originalLan,
        releaseYear,
        contentRating,
        tags,
        bg_url,
        status
      );
      alert("Images uploaded and chapter created successfully!");
      refreshPage();
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  // DOn't add any more code after this or else will have errors!!!
  return (
    <div className="bg-blue-100 min-h-screen p-5">
      <div className="max-w-[50vw] mx-auto bg-gray-800 text-white shadow-lg rounded-lg p-5">
        <h1 className="text-center text-2xl font-bold mb-5">
          Editing Manga: <span className="text-orange-500">{manga?.title}</span>
        </h1>

        {/* Title */}
        <div className="mb-5 space-y-2">
          <Label className="block text-white font-medium" htmlFor="title">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            defaultValue={manga?.title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* OG LAN */}
        <div className="mb-5 space-y-2">
          <Label className="block text-white font-medium" htmlFor="og-Lan">
            Original Language
          </Label>
          <select
            id="original-language"
            name="original-language"
            required
            value={originalLan} // Bind to the state
            className="add-manga-default-form text-white min-h-[5vh] text-xs"
            onChange={(e) => {
              setOriginalLan(e.target.value); // Update state when value changes
              e.target.classList.remove("text-gray-400");
            }}
          >
            <option
              value="DEFAULT"
              disabled
              className="bg-gray-800 text-gray-400"
            >
              Select Original Language
            </option>
            <option value="🇯🇵" className="bg-gray-800 text-white">
              🇯🇵 Japanese
            </option>
            <option value="🇰🇷" className="bg-gray-800 text-white">
              🇰🇷 Korean
            </option>
            <option value="🇹🇭" className="bg-gray-800 text-white">
              🇹🇭 Thailand
            </option>
            <option value="🇬🇧" className="bg-gray-800 text-white">
              🇬🇧 English
            </option>
            <option value="🇨🇳" className="bg-gray-800 text-white">
              🇨🇳 Chinese
            </option>
            <option value="🇫🇷" className="bg-gray-800 text-white">
              🇫🇷 French
            </option>
            <option value="🇪🇸" className="bg-gray-800 text-white">
              🇪🇸 Spanish
            </option>
            <option value="🇩🇪" className="bg-gray-800 text-white">
              🇩🇪 German
            </option>
            <option value="🇮🇹" className="bg-gray-800 text-white">
              🇮🇹 Italian
            </option>
            <option value="🇧🇷" className="bg-gray-800 text-white">
              🇧🇷 Portuguese
            </option>
            <option value="Russian" className="bg-gray-800 text-white">
              🇷🇺 Russian
            </option>
          </select>
        </div>

        {/* Alternative Titles */}
        <div className="mb-5 space-y-2">
          <Label className="block text-white font-medium" htmlFor="altTitles">
            Alternative Titles
            <button
              type="button"
              className="ml-3 hover:scale-105 border px-2 py-1 rounded-sm text-xs"
              onClick={() => setIsOpenModalTitles(true)}
            >
              + Add more titles
            </button>
          </Label>
          {altTitles?.length > 0 || altTitles === undefined ? (
            <div className="flex flex-col space-y-2 p-3 rounded-sm border-[1px]">
              {altTitles?.map((title: any, index: any) => (
                <div
                  className={`pb-2  relative" key={index} ${altTitles.length > 1 && index < altTitles.length - 1 ? "border-b-[1px]" : ""}`}
                >
                  <p className="text-lg font-semibold font-mono text-orange-300">
                    Title: #{index + 1}
                  </p>
                  <p>Language: {title.flag}</p>
                  <p>Name: {title.content}</p>
                  <button
                    className="text-red-500 font-semibold absolute top-0 right-0 text-2xl"
                    type="button"
                    onClick={() => handleOnDelAltTiles(title)}
                  >
                    <FontAwesomeIcon icon={faX} className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No Alternative Titles Found
            </p>
          )}
          {/* <Input defaultValue={manga?.alternative_titles} /> */}
          {isOpenModalTitles && (
            <CreateNewAlternativeTitlesModal
              setAlternativeTitles={setAltTitlesTempp}
              onClose={() => handleOnClose("altT")}
            />
          )}
        </div>

        {/* Description */}
        <div className="mb-5">
          <Label className="block text-white font-medium" htmlFor="altTitles">
            Description
            <button
              type="button"
              className="ml-3 hover:scale-105 border px-2 py-1 rounded-sm text-xs"
              onClick={() => setIsOpenModalSynopsis(true)}
            >
              Add Or Change Descripton
            </button>
          </Label>
          {isOpenModalSynopsis && (
            <CreateNewSynopsisModal
              setSynopsis={setDes}
              onClose={() => handleOnClose("synopsis")}
            />
          )}
          <p className="border-[1px] p-2 mt-3 text-sm whitespace-pre-line rounded-sm">
            {des}
          </p>
        </div>

        {/* Cover Image */}
        <div className="mb-5 flex flex-col items-center">
          <Label className="block text-white font-medium" htmlFor="cover-image">
            Cover Image
          </Label>
          <img
            src={
              typeof bgCover === "string"
                ? bgCover
                : bgCover
                  ? URL.createObjectURL(bgCover)
                  : undefined // important here, bgCover must exist first, so it must not be undefined, then it can be used to create an url
            }
            alt="Manga Cover"
            className="w-40 h-56 object-cover rounded-md mt-2"
          />
          <Input
            type="file"
            id="cover-image"
            accept="image/*"
            className="mt-2"
            onChange={handleImageChange}
          />
        </div>

        {/* Status */}
        <div className="mb-5 space-y-2">
          <Label className="block text-white font-medium" htmlFor="status">
            Status
          </Label>
          <select
            id="status"
            name="status"
            value={status} // Bind to the state
            className="add-manga-default-form text-white min-h-[5vh] text-xs"
            onChange={(e) => {
              setStatus(e.target.value); // Update state when value changes
              e.target.classList.remove("text-gray-400");
            }}
          >
            <option
              value="DEFAULT"
              disabled
              className="bg-gray-800 text-gray-400"
            >
              Select Status
            </option>
            <option className="bg-gray-800 text-gray-400" value="Ongoing">
              Ongoing
            </option>
            <option className="bg-gray-800 text-gray-400" value="Hiatus">
              On Hiatus
            </option>
            <option className="bg-gray-800 text-gray-400" value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {/* Release Year */}
        <div className="mb-5 space-y-2">
          <Label
            className="block text-white font-medium"
            htmlFor="release-year"
          >
            Release Year
          </Label>
          <Input
            type="number"
            id="release-year"
            name="release-year"
            min="1600"
            max="2025"
            defaultValue={releaseYear}
            onChange={(e) => setReleaseYear(Number(e.target.value))}
            className="add-manga-default-form text-white min-h-[5vh] text-xs"
          />
        </div>

        {/* Content Rating */}
        <div className="mb-5 space-y-2">
          <Label
            className="block text-white font-medium"
            htmlFor="content-rating"
          >
            Content Rating
          </Label>
          <select
            id="content-rating"
            name="content-rating"
            value={contentRating} // Bind to the state
            className="add-manga-default-form text-white min-h-[5vh] text-xs"
            onChange={(e) => {
              setContentRating(e.target.value); // Update state when value changes
              e.target.classList.remove("text-gray-400");
            }}
          >
            <option
              value="DEFAULT"
              disabled
              className="bg-gray-800 text-gray-400"
            >
              Select Content Rating
            </option>
            <option value="Safe" className="bg-gray-800 text-white">
              Safe
            </option>
            <option value="Suggestive" className="bg-gray-800 text-white">
              Suggestive
            </option>
            <option value="Ecchi" className="bg-gray-800 text-white">
              Ecchi
            </option>
            <option value="Nsfw" className="bg-gray-800 text-white">
              NSFW
            </option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-5 space-y-3">
          <Label className="block text-white font-medium">
            Tags
            <button
              type="button"
              className="ml-3 hover:scale-105 border px-2 py-1 rounded-sm text-xs"
              onClick={() => setIsOpenModalTags(true)}
            >
              Add Tags
            </button>
          </Label>
          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-200 text-blue-700 rounded text-sm relative w-fit px-2 py-1 flex items-center"
                >
                  {tag}
                  <button
                    className="absolute -top-1 -right-2 bg-white w-4 h-4 rounded-full flex items-center justify-center text-lg"
                    type="button"
                    onClick={() => handleOnDelTags(tag)}
                  >
                    <FontAwesomeIcon
                      icon={faMinus}
                      className="text-sm text-red-500"
                    />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No Info Found</p>
            )}
          </div>
        </div>
        {isOpenModalTags && (
          <AddNewTagsModal
            setTags={setAltTagsTempp}
            onClose={() => setIsOpenModalTags(false)}
          />
        )}

        {/* Creators */}
        <div className="mb-5 space-y-2">
          <Label className="block text-white font-medium" htmlFor="creators">
            Creators
            <button
              type="button"
              className="ml-3 hover:scale-105 border px-2 py-1 rounded-sm text-xs"
              onClick={() => setIsOpenModalCreators(true)}
            >
              Add Creators
            </button>
          </Label>
          {isOpenModalCreators && (
            <AddNewCreatorsModal
              setCreators={setAltTagsCreator}
              onClose={() => setIsOpenModalCreators(false)}
            />
          )}
          <div className="space-y-2 h-fit pb-5 border-b-[1px]">
            <h1 className="font-semibold">Authors</h1>
            {creators &&
            creators?.filter((creator: any) => creator.role === "author")
              .length > 0 ? (
              creators
                ?.filter((creator: any) => creator.role === "author")
                .map((creator) => (
                  <div key={creator.role} className="mt-2">
                    <span>{creator.name}</span>
                    <button
                      type="button"
                      className="ml-3"
                      onClick={() => handleOnDelCreators(creator)}
                    >
                      <FontAwesomeIcon
                        icon={faMinus}
                        className="text-sm text-red-500"
                      />
                    </button>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 italic">No Info Found</p>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="font-semibold">Artists</h1>
            {creators &&
            creators?.filter((creator: any) => creator.role === "artist")
              .length > 0 ? (
              creators
                ?.filter((creator: any) => creator.role === "artist")
                .map((creator) => (
                  <div key={creator.role} className="mt-2">
                    <span>{creator.name}</span>
                    <button
                      type="button"
                      className="ml-3"
                      onClick={() => handleOnDelCreators(creator)}
                    >
                      <FontAwesomeIcon
                        icon={faMinus}
                        className="text-sm text-red-500"
                      />
                    </button>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 italic">No Info Found</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          className="w-full mt-5 bg-blue-500 text-white hover:bg-blue-600"
          disabled={updateLoading}
          type="button"
          onClick={() => handleSubmit()}
        >
          {!updateLoading ? (
            <p>Save Changes</p>
          ) : (
            <p>Syncing changes to database. Please wait...</p>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditMangaPage;
