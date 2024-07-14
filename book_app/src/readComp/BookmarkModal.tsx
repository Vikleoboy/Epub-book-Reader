import {motion} from 'framer-motion'
import { IoClose } from "react-icons/io5";
import { useState , useEffect } from 'react';


export const AddBookMarkModal = ({
  setbookMarkModal,
  setBookmarks,
  location,
  id,
}) => {
  const [inputValue, setInputValue] = useState("");
  let baseUrl: string = "http://localhost:3002/";
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const addBookmark = () => {
    let adder = async () => {
      let adbk = await axios.post(
        baseUrl + `addBookMark`,
        { id: id, name: inputValue, cfiValue: location.start.cfi },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let bkm = await axios.get(baseUrl + `getBookMarks?id=${id}`);

      if (location) {
        console.log(location.start.cfi);
        console.log(bkm.data.BookMarks);
        setBookmarks(bkm.data["BookMarks"]);
        setbookMarkModal(false);
      }
    };
    adder();
  };

  return (
    <motion.div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring" }}
        className="bg-gray-50 p-6 rounded-md shadow-md w-80 relative"
      >
        <div className="absolute top-2 text-lg right-2 text-gray-600 bg-gray-200 flex justify-center items-center p-1 rounded-lg  ">
          <motion.button
            initial={{ rotate: 0 }}
            whileHover={{ rotate: [10, -10, 0] }}
            transition={{ duration: 0.4 }}
            onClick={() => setbookMarkModal(false)}
            className=""
          >
            <IoClose />
          </motion.button>
        </div>
        <h2 className="text-lg font-medium mb-4 text-gray-500">Add Bookmark</h2>
        <input
          type="text"
          id="bookMarkName"
          value={inputValue}
          onChange={handleInputChange}
          className="border text-gray-500 font-medium border-gray-300 focus:border-none outline focus:outline-gray-400 p-2 w-full mb-4 rounded-md bg-gray-100"
          placeholder="Enter bookmark name"
        />
        <motion.button
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.03 }}
          exit={{ scale: 1 }}
          onClick={addBookmark}
          transition={{ duration: 0.3, type: "spring" }}
          className="focus:outline-none w-full text-white bg-gray-700  focus:ring-4 focus:ring-gray-300 font-medium  rounded-lg text-md px-3  py-1.5 mr-2 mb-2 dark:bg-blue-600/80 dark:hover:bg-blue-700/80 dark:focus:ring-blue-500/80"
        >
          Save Bookmark
        </motion.button>
      </motion.div>
    </motion.div>
  );
};