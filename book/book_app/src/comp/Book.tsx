import { motion } from "framer-motion";
import * as Bs from "react-icons/bs";
import * as Ai from "react-icons/ai";
import * as Gr from "react-icons/gr";
import "./css/Book.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../assets/book-covers-big-2019101610.jpg";

export const Book = (props) => {
  let baseUrl = "http://localhost:3002/";
  const [cover, setCover] = useState();
  useEffect(() => {
    let m = async () => {
      let bk = await axios.get(baseUrl + "getCover?id=" + props.bok?.Name);
      console.log(bk);
      // const img = new Blob([bk.data]);
      // const url = URL.createObjectURL(img);
      // console.log(url);
      setCover(bk.data.img);
    };
    m();
  }, []);

  let openBook = () => {
    window.open("/read/" + props.bok.Name, "_blank");
  };

  return (
    <motion.div
      style={{ width: `${props.val}%` }}
      tabIndex={0}
      className=" w-[30%] rounded-2xl  flex flex-col    m-1 my-2  "
    >
      <div className=" relative  flex justify-end text-gray-500 ">
        <div tabIndex={1} className="z-20 relative threeDots">
          <Bs.BsThreeDots />
          <div className=" relative  b">
            <div className=" bg-gray-100 dark:text-gray-400 dark:bg-gray-800  border dark:border-gray-500 border-gray-300 shadow-lg dark:shadow-slate-500   rounded-lg  overflow-hidden  threeContent z-30 flex flex-col p-2">
              <div className=" flex  px-1 justify-between">
                <div
                  tabIndex={2}
                  className=" text-xl text-gray-400 focus:text-red-500 "
                >
                  <Ai.AiFillHeart />
                </div>
                <div className=" text-2xl text-gray-100 ">
                  <Gr.GrFormAdd />
                </div>
              </div>
              <p>something</p>
              <p>something</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3" onClick={openBook}>
        <img
          className=" z-0  shadow-xl rounded-lg shadow-gray-800  w-full object-contain "
          src={cover === "error" ? logo : `data:image/jpeg;base64,${cover}`}
          alt=""
        />
      </div>
      <div className=" my-1 px-2">
        <div className="flex">
          <p className=" text-xl dark:text-gray-400 h-10 overflow-hidden whitespace-nowrap ">
            {" "}
            {props.bok["Name"]}{" "}
          </p>
          <p className="p-1">...</p>
        </div>
        <div className=" flex justify-between ">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
            Reading
          </span>

          <p className=" text-gray-400">20%</p>
        </div>
      </div>
    </motion.div>
  );
};
