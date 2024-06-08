import { motion } from "framer-motion";
import * as Bs from "react-icons/bs";
import * as Ai from "react-icons/ai";
import * as Gr from "react-icons/gr";
import "./css/Book.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../assets/book-covers-big-2019101610.jpg";
import { RiDeleteBinLine } from "react-icons/ri";

export const Book = (props) => {
  let baseUrl = "http://localhost:3002/";
  const [cover, setCover] = useState();
  const [menu, setmenu] = useState(false);
  useEffect(() => {
    let m = async () => {
      let bk = await axios.get(baseUrl + "getCover?id=" + props.bok?.Name);

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

  let DelBook = async () => {
    await axios.get(baseUrl + `delBook?id=${props.bok.Name}`);
    props.fresh((d) => !d);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ width: `${props.val}%`, opacity: 1 }}
      transition={{ opacity: { ease: "easeIn", duration: 0.5 } }}
      tabIndex={0}
      className=" rounded-2xl  flex flex-col    m-1 my-2  "
    >
      {/* <div onClick={() => setmenu(true)} className=" flex justify-end">
        <Bs.BsThreeDots />
        <div className=" absolute bg-slate-400 p-10">Something</div>
      </div> */}
      <div className=" relative  flex justify-end text-gray-500 ">
        <div tabIndex={1} className="z-20 relative threeDots">
          <Bs.BsThreeDots />
          <motion.div className=" relative  b">
            <div className=" bg-gray-100 dark:text-gray-400 dark:bg-gray-800  border dark:border-gray-500 border-gray-300 shadow-lg dark:shadow-slate-500   rounded-lg  overflow-hidden  threeContent z-30 flex flex-col p-2">
              <div className=" flex  px-1 justify-between">
                <div
                  tabIndex={2}
                  className=" text-xl hover:text-2xl text-gray-400  "
                >
                  <Ai.AiFillHeart />
                </div>
                <motion.div
                  animate={{ rotate: 0 }}
                  whileHover={{ rotate: [10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  onClick={DelBook}
                  className=" text-xl  text-red-500 "
                >
                  {/* <Gr.GrFormAdd /> */}

                  <RiDeleteBinLine />
                </motion.div>
              </div>
              <motion.div>
                <motion.p
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ ease: "easeIn", duration: 1 }}
                >
                  Somthing
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeIn", duration: 1 }}
        className="p-3 w-full"
        onClick={openBook}
      >
        <img
          className=" z-0  shadow-xl rounded-lg shadow-gray-800  w-full object-contain "
          src={cover === "error" ? logo : `data:image/jpeg;base64,${cover}`}
          alt=""
        />
      </motion.div>
      <div className=" my-1 px-2">
        <div className="flex">
          <p className=" text-xl dark:text-gray-400 h-10 overflow-hidden whitespace-nowrap ">
            {props.bok["Name"]}
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
