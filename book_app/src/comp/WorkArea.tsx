import { useState } from "react";
import { Book } from "./Book.tsx";
import { Slider } from "./Slider.tsx";
import { useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export const WorkArea = (props) => {
  const [bookWidth, setbookWidth] = useState(localStorage.getItem("w"));
  const [Books, setBooks] = useState([]);

  const [refresh, setrefresh] = useState(false);
  let baseUrl = "http://localhost:3002/";

  useEffect(() => {
    const func = async () => {
      if (props.TagString !== "") {
        console.log("comeing in here for no reason ");
        var book = await axios.get(baseUrl + `home?tag=${props.TagString}`);
      } else {
        console.log("here");
        var book = await axios.get(baseUrl + "home");
      }

      console.log(book.data);

      setBooks(book.data.info);
    };
    func();
  }, [refresh, props.TagString]);

  function searchBooks(keyword) {
    return function ser(book) {
      return book.Name?.toLowerCase().includes(keyword.toLowerCase());
    };
  }
  let keyWord;
  if (props.keyword === undefined) {
    keyWord = "";
  } else {
    keyWord = props.keyword;
  }

  return (
    <div className=" relative col-span-6   rounded flex flex-col  ">
      <div className="titlebar">
        <p className=" pt-20 px-14    text-slate-900 dark:text-gray-300 text-6xl">
          Library
        </p>
      </div>
      <Slider
        val={bookWidth}
        refresh={setrefresh}
        changeBookWidth={setbookWidth}
      />

      <div className=" h-full overflow-y-scroll overflow-x-hidden flex justify-evenly flex-wrap p-10 ">
        {Books?.filter(searchBooks(keyWord)).map((i) => {
          return (
            <Book
              key={i["id"]}
              bok={i}
              id={i["Name"]}
              fresh={setrefresh}
              val={bookWidth}
            />
          );
        })}

        {Books === "error" ||
          (Books === undefined && (
            <div className=" text-2xl p-20  dark:text-gray-400  w-full h-full text-center">
              No Books Added
            </div>
          ))}
      </div>
    </div>
  );
};
