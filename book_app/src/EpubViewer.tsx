import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";



const EpubViewer = ({url}) => {
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  const [book, setBook] = useState(null);
  // const [url, seturl] = useState('')
  const [location, setLocation] = useState(null);
  const [pageNumber, setPageNumber] = useState("Calculating...");
  const [totalPages, setTotalPages] = useState("Calculating...");
  const [bookmarks, setBookmarks] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [toc, setToc] = useState([]);

  const { id } = useParams();
  console.log(id);
  

  useEffect(() => {
    const initializeBook = async () => {
      // console.log('now here')
      // let k = await axios.get(`http://localhost:3002/Read?id=${id}`)
      // let url = k.data.url
        
      // seturl(url)
      const book = ePub(url);
      setBook(book);
      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        allowScriptedContent: true,
      });
      renditionRef.current = rendition;

      rendition.on("relocated", (location) => {
        setLocation(location);
        updatePageNumber(location);
      });

      rendition.on("selected", (cfiRange) => {
        const highlight = {
          cfiRange,
          text: rendition.getRange(cfiRange).toString(),
        };
        setHighlights((prev) => [...prev, highlight]);
        rendition.annotations.highlight(cfiRange, {}, () => {}, "highlight");
      });

      try {
        await book.ready;
        const navigation = await book.loaded.navigation;
        console.log(navigation);
        setToc(navigation.toc); // Ensure TOC is correctly set
        await book.locations.generate(1600);
        setTotalPages(book.locations.length());
        rendition.display();
        rendition.injectStylesheet(` body {
          background-colour : black ; 
        
          }`);
      } catch (error) {
        console.error("Error generating locations:", error);
      }
    };

    initializeBook();

    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }
    };
  }, [url]);

  const updatePageNumber = (location) => {
    if (location && book) {
      const currentPage = book.locations.locationFromCfi(location.start.cfi);
      setPageNumber(currentPage + 1);
    }
  };

  const goPrev = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  const goNext = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  const goToLocation = (location) => {
    console.log(
      "came in location ",
      location.split(".xhtml")[0],
      renditionRef.current
    );
    if (renditionRef.current) {
      let base = renditionRef.current.location.start.href.split("/");
      base.pop();
      base = base.join("/");

      renditionRef.current.display(base + "/" + location);
    }
  };

  const addBookmark = () => {
    if (location) {
      setBookmarks((prev) => [...prev, location.start.cfi]);
    }
  };

  const goToBookmark = (cfi) => {
    if (renditionRef.current) {
      

      renditionRef.current.display(cfi);
    }
  };

  const removeHighlight = (cfiRange) => {
    setHighlights((prev) =>
      prev.filter((highlight) => highlight.cfiRange !== cfiRange)
    );
    renditionRef.current.annotations.remove(cfiRange, "highlight");
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div ref={viewerRef} className="w-full h-[100vh] bg-gray-100"></div>
      <div className=" absolute flex justify-between w-full px-10 top-1/2 space-x-4 mt-4">
        <button
          onClick={goPrev}
          className="text-4xl text-gray-600 rounded"
        >
          <IoIosArrowBack/>
        </button>
        <button
          onClick={goNext}
          className=" text-4xl text-gray-600 rounded"
        >
          <IoIosArrowForward />
        </button>
        
      </div>

      <button
          onClick={() => goToLocation("epubcfi(/6/2[cover]!/6)")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go to Cover
        </button>
        <button
          onClick={addBookmark}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Bookmark
        </button>
      <div className="mt-4 text-black">
        Current Location: {location ? location.start.cfi : "Unknown"}
      </div>
      <div className="text-black">
        Page Number: {pageNumber} / {totalPages}
      </div>
      <div className="mt-4 text-black">
        <h3>Table of Contents:</h3>
        <ul>
          {Array.isArray(toc) &&
            toc.map((chapter, index) => (
              <li key={index}>
                <button
                  onClick={() => goToLocation(chapter.href)}
                  className="text-blue-500 underline"
                >
                  {chapter.label}
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="mt-4 text-black">
        <h3>Bookmarks:</h3>
        <ul>
          {bookmarks.map((cfi, index) => (
            <li key={index}>
              <button
                onClick={() => goToBookmark(cfi)}
                className="text-blue-500 underline"
              >
                {cfi}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-black">
        <h3>Highlights:</h3>
        <ul>
          {highlights.map((highlight, index) => (
            <li key={index}>
              <span>{highlight.text}</span>
              <button
                onClick={() => removeHighlight(highlight.cfiRange)}
                className="ml-2 text-red-500 underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EpubViewer;
