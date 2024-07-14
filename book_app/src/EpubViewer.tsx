import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import { useParams } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";

import ViewerNavbar from "./readComp/ViewerNavbar.tsx";

const EpubViewer = ({ url, bkid }) => {
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [pageNumber, setPageNumber] = useState("Calculating...");
  const [totalPages, setTotalPages] = useState("Calculating...");
  const [toc, setToc] = useState([]);

  const { id } = useParams();
  console.log(id);

  var darkThemeStyles = `

  @font-face {
        font-family: 'Roboto';
        src: url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
      }
body {
        background-color: #121212;
        color: #e0e0e0;
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 10px;
      }
      p {
        color: #e0e0e0;
        font-size: 18px;
      }
      h1 {
        color: #bb86fc;
      }
      a {
        color: #bb86fc;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }


`;

  useEffect(() => {
    const initializeBook = async () => {
      const book = ePub(url);
      setBook(book);

      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        allowScriptedContent: true,
      });
      renditionRef.current = rendition;

      // Register the dark theme
      renditionRef.current.themes.registerCss("dark", darkThemeStyles);

      renditionRef.current.on("rendered", () => {
        setLoading(false);
        renditionRef.current.themes.select("dark");
      });

      book.loaded.metadata.then((metadata) => {
        setTitle(metadata.title);
      });

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
        setToc(navigation.toc);
        await book.locations.generate(1600);
        setTotalPages(book.locations.length());
        rendition.display();
      } catch (error) {
        console.error("Error generating locations:", error);
      }
    };

    initializeBook();
    setLoading(false);

    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          goPrev();
          break;
        case "ArrowRight":
          goNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }
    };
  }, [url]);

  const updatePageNumber = (location) => {
    if (true) {
      var currentPage = location.start.displayed.page;
      console.log(currentPage);
      setPageNumber(currentPage);
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

  return (
    <>
      <div className="w-full h-full relative overflow-hidden bg-gray-50">
        <ViewerNavbar
          title={title}
          toc={toc}
          bkid = {bkid}
          renditionRef={renditionRef}
        />

        {/* <div className=" absolute w-full p-3 bg-slate-400 z-40 top-[92%]">
          {pageNumber}
        </div> */}

        <div className="flex w-full h-[100vh] flex-col items-center relative">
          <div ref={viewerRef} className="w-full h-[100vh] bg-gray-100"></div>
          {loading && (
            <div className="z-20 w-full h-full text-black flex justify-center items-center bg-gray-100">
              Loading ..
            </div>
          )}

          <div className="absolute flex justify-between w-full px-[1%] top-1/2 space-x-4 mt-4">
            <button onClick={goPrev} className="text-4xl text-gray-400 rounded">
              <IoIosArrowBack />
            </button>
            <button onClick={goNext} className="text-4xl text-gray-400 rounded">
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EpubViewer;
