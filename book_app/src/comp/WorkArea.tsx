import { useState } from "react";
import { Book } from "./book.tsx";
import { Slider } from "./MainComp/Slider.tsx";
import { useEffect } from "react";
import axios from "axios";

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
    <div className=" rounded flex flex-col w-full ">
      <div className="titlebar">
        <p className=" pt-20 px-14  text-slate-900 dark:text-gray-300 text-6xl">
          Library
        </p>
      </div>
      <Slider
        val={bookWidth}
        refresh={setrefresh}
        changeBookWidth={setbookWidth}
      />
      <div className=" flex flex-wrap w-full h-full overflow-y-scroll">
        <div className=" flex flex-wrap p-10 w-full ">
          {Books?.map((i) => {
            return <Book key={i["id"]} bok={i} id={i["id"]} val={bookWidth} />;
          })}

          {Books === "error" ||
            (Books === undefined && (
              <div className=" text-2xl p-20  dark:text-gray-400  w-full h-full text-center">
                No Books Added
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
