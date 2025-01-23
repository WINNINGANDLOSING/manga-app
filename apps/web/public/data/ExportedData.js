import { getAllManga } from "@/lib/actions";

const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// ExportedData.js

// Fetching Manga Data

export const MangaList = async () => {
  try {
    const data = await getAllManga();
    return data;
  } catch (error) {
    console.error("Error fetching manga data:", error);
    return [];
  }
};

export const TrendingData = async () => {
  try {
    const data = await MangaList();
    return getRandomItems(data, 10);
  } catch (err) {
    console.error("failed generating data");
  }
};
export const TopByMonthData = async () => {
  try {
    const data = await MangaList();
    return getRandomItems(data, 6);
  } catch (err) {
    console.error("failed generating data");
  }
};
export const TopByWeekData = async () => {
  try {
    const data = await MangaList();
    return getRandomItems(data, 6);
  } catch (err) {
    console.error("failed generating data");
  }
};
export const TopByDayData = async () => {
  try {
    const data = await MangaList();
    return getRandomItems(data, 6);
  } catch (err) {
    console.error("failed generating data");
  }
};

// export const TopByMonthData = getRandomItems(MangaList, 6);
// export const TopByWeekData = getRandomItems(MangaList, 6);
// export const TopByDayData = getRandomItems(MangaList, 6);

// Fetching User Data
