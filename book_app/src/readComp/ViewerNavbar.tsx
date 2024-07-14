import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineBookmarkSquare } from "react-icons/hi2";
import { FaBookmark, FaRegFileAlt } from "react-icons/fa";
import { IoBookmarksOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import { IoBookmark } from "react-icons/io5";
import { AddBookMarkModal } from "./BookmarkModal.tsx";

import BookmarkList from "./BookmarkList";
import ChapterList from "./ChapterList";

const ViewerNavbar = ({ title, toc , bkid , renditionRef }) => {
  const [chapsOn, setChapsOn] = useState(false);
  const [bookmarksOn, setBookmarksOn] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [bookMarks, setbookMarks] = useState([]);
  const [bookMarkModal, setbookMarkModal] = useState(false);

  useEffect(() => {
    let func = async () => {
      let baseUrl = "http://localhost:3002/";
      let bkm = await axios.get(baseUrl + "getBookMarks?id=" + bkid);
      setbookMarks(bkm.data.BookMarks);
    };
    func();
  }, []);

  const goToLocation = (location) => {
    if (renditionRef.current) {
      let base = renditionRef.current.location.start.href.split("/");
      console.log(base);

      let o;
      o = location;
      renditionRef.current.display(o);
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

  const tabs = [
    { icon: <HiOutlineBookmarkSquare />, label: "Chapters" },
    { icon: <FaBookmark />, label: "Bookmark" },
    { icon: <FaRegFileAlt />, label: "Highlights" },
  ];

  return (
    <>
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

        {/* Nav Bar  */}
        <div className="absolute w-full justify-end flex items-center right-4 space-x-2">
          

          <div className="relative">
            <button
              onClick={() => setBookmarksOn(!bookmarksOn)}
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

                {/* Add Bookmarks Button */}
                {selectedTab === 1 && (
                  <div className=" mt-2 flex justify-between items-center">
                    <p className=" text-xl pl-2">BookMarks</p>
                    <button
                      className=" bg-gray-200 text-gray-600 px-2 py-1 rounded-md shadow hover:bg-gray-300 "
                      onClick={() => setbookMarkModal(true)} // Replace with actual functionality
                    >
                      <IoMdAdd />
                    </button>
                  </div>
                )}

                {selectedTab === 0 && (
                  <div className=" mt-2 flex justify-between items-center">
                    <p className=" text-xl pl-2 ">Chapters</p>
                  </div>
                )}

                {selectedTab === 2 && (
                  <div className=" mt-2 flex justify-between items-center">
                    <p className=" text-xl pl-2">HighLights</p>
                    <button
                      className=" bg-gray-200 text-gray-600 px-2 py-1 rounded-md shadow hover:bg-gray-300 "
                      onClick={() => alert("Add Bookmarks clicked!")} // Replace with actual functionality
                    >
                      <IoMdAdd />
                    </button>
                  </div>
                )}
                {/* Contant of the Tabs */}
                <div className="flex-1 mt-2 overflow-y-auto relative rounded-lg">
                  {/* Render content based on selected tab */}
                  {selectedTab === 0 && (
                    <div>
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
                    </div>
                  )}

                  {selectedTab === 1 && (
                    <div className="flex-1 mt-2 overflow-y-auto relative rounded-lg">
                      <div>
                        <div className="flex flex-col h-full overflow-y-auto">
                          {bookMarks.map((bookmark, index) => (
                            <div
                              key={index}
                              onClick={() => goToBookmark(bookmark.cfiValue)}
                              className="cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-300"
                            >
                              {bookmark.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedTab === 2 && (
                    <div className="flex flex-col h-full overflow-y-auto">
                      <div>Notes</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {bookMarkModal && (
        <AddBookMarkModal
          setBookmarks={setbookMarks}
          setbookMarkModal={setbookMarkModal}
          location={location}
          id={bkid}
        />
      )}
    </>
  );
};

export default ViewerNavbar;


