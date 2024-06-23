import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import { useParams } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import { HiOutlineBookmarkSquare } from "react-icons/hi2";
import { IoBookmarksOutline } from "react-icons/io5";
import { PiTextAaBold } from "react-icons/pi";
import { IoBookmark } from "react-icons/io5";
import { FaBookmark, FaRegFileAlt } from "react-icons/fa";

const EpubViewer = ({ url }) => {
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [chapsOn, setChapsOn] = useState(false);
  const [location, setLocation] = useState(null);
  const [pageNumber, setPageNumber] = useState("Calculating...");
  const [totalPages, setTotalPages] = useState("Calculating...");
  const [bookmarks, setBookmarks] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [bookmarksOn, setbookmarksOn] = useState(false);
  const [toc, setToc] = useState([]);

  const { id } = useParams();
  console.log(id);

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

      renditionRef.current.on("rendered", () => {
        setLoading(false);
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
        rendition.injectStylesheet(`body { background-color: black; }`);
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

  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { icon: <HiOutlineBookmarkSquare />, label: "Chapters" },
    { icon: <FaBookmark />, label: "Bookmark" },
    { icon: <FaRegFileAlt />, label: "Highlites" },
  ];

  return (
    <>
      <div className="w-full h-full relative overflow-hidden bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0, y: 0 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeIn", duration: 1, type: "spring" }}
          className="bg-gray-100 shadow-md z-20 h-12 flex justify-center items-center text-black w-full text-md absolute top-0"
        >
          <div>
            <p className="text-lg titlebar">{title}</p>
          </div>
          <div className="absolute w-full justify-end flex items-center right-4 space-x-2">
            <div className="relative">
              <button
                onClick={() => setChapsOn(!chapsOn)}
                className="bg-gray-200 text-blue-600 text-xl px-3 py-1 rounded-md shadow "
              >
                <HiOutlineBookmarkSquare />
              </button>
              {chapsOn && (
                <motion.div
                  className="absolute top-0 right-0 mt-12 w-64 h-96 overflow-y-auto z-30 bg-gray-200 p-4 rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mt-4 text-black">
                    <h3>Table of Contents:</h3>
                    <div className="flex flex-col">
                      {toc.map((chapter, index) => (
                        <div
                          key={index}
                          onClick={() => goToLocation(chapter.href)}
                          className="cursor-pointer p-1 hover:bg-gray-300"
                        >
                          {chapter.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setbookmarksOn(!bookmarksOn)}
                className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md shadow hover:bg-gray-300"
              >
                {/* &#x22EE; */}
                <IoBookmarksOutline />
              </button>
              {bookmarksOn && (
                <motion.div
                  className="absolute flex flex-col top-0 right-0 mt-12 w-64 h-96 bg-gray-100 shadow-lg z-30 p-2 rounded-xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gray-200 px-2 py-1 rounded-lg shadow-sm">
                    <div className="relative flex justify-around rounded-lg p-2">
                      <motion.div
                        className="absolute top-0 left-0 w-1/3 h-full bg-white rounded-lg shadow-md"
                        initial={false}
                        animate={{ x: selectedTab * 100 + "%" }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                      {tabs.map((tab, index) => (
                        <div
                          key={index}
                          className={`relative z-10 w-1/2 text-center text-sm cursor-pointer ${
                            selectedTab === index
                              ? "text-blue-500"
                              : "text-gray-500"
                          }`}
                          onClick={() => setSelectedTab(index)}
                        >
                          <span className="flex justify-center items-center">
                            {tab.icon}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 mt-2 overflow-y-auto relative rounded-lg">
                    {selectedTab === 0 && (
                      <div className="flex flex-col h-full overflow-y-auto">
                        {toc.map((chapter, index) => (
                          <div
                            key={index}
                            onClick={() => goToLocation(chapter.href)}
                            className="cursor-pointer p-1 hover:bg-gray-300"
                          >
                            {chapter.label}
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedTab === 1 && (
                      <div className="flex flex-col h-full overflow-y-auto">
                        <div>Text Content</div>
                      </div>
                    )}
                    {selectedTab === 2 && (
                      <div className="flex flex-col h-full overflow-y-auto">
                        <div>Text Content</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

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
