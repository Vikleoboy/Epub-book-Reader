import axios from "axios";
import ePub from "epubjs";

// Fetch bookmarks from the server
export const fetchBookmarks = async (bkid) => {
  const baseUrl = "http://localhost:3002/";
  const response = await axios.get(`${baseUrl}getBookMarks?id=${bkid}`);
  return response.data.BookMarks;
};

// Add a new bookmark to the server
export const addBookmark = async (id, name, cfiValue) => {
  const baseUrl = "http://localhost:3002/";
  await axios.post(`${baseUrl}addBookMark`, { id, name, cfiValue }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Fetch word definition
export const fetchDefinition = async (word) => {
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = response.data;
    if (data && data[0] && data[0].meanings[0].definitions[0]) {
      return data[0].meanings[0].definitions[0].definition;
    }
    return "Definition not found";
  } catch (error) {
    console.error("Error fetching definition:", error);
    return "Error fetching definition";
  }
};
