import { useState } from "react";
import { Book } from "./Book.tsx";
import { Slider } from "./Slider.tsx";
import { useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export const WorkArea = (props) => {
  const [bookWidth, setbookWidth] = useState(localStorage.getItem("w"));
  const [Books, setBooks] = useState();
  const [refresh, setrefresh] = useState(false);
  let baseUrl = "http://localhost:3002/";

  useEffect(() => {
    const func = async () => {
      let book = await axios.get(baseUrl + "home");

      console.log(book.data);

      setBooks(book.data.info);
    };
    func();
  }, [refresh]);

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

      <div className=" overflow-y-scroll flex justify-evenly flex-wrap p-10 ">
        {Books?.map((i) => {
          return (
            <Book
              key={i["id"]}
              bok={i}
              id={i["id"]}
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
