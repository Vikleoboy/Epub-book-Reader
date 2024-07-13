import { animate, motion } from "framer-motion";
import * as Bs from "react-icons/bs";
import * as Ai from "react-icons/ai";
import * as Gr from "react-icons/gr";
import "./css/Book.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../assets/book-covers-big-2019101610.jpg";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdCancel } from "react-icons/md";

export const Book = (props) => {
  let baseUrl = "http://localhost:3002/";
  const [cover, setCover] = useState();
  const [refreshTags, setrefreshTag] = useState(false);
  const [Tags, setTags] = useState([]);
  const [bookTags, setbookTags] = useState([]);
  useEffect(() => {
    let m = async () => {
      let bk = await axios.get(baseUrl + "getCover?id=" + props.bok?.id);

      // const img = new Blob([bk.data]);
      // const url = URL.createObjectURL(img);
      // console.log(url);
      setCover(bk.data.img);
      // console.log(bk.data.img);

      let T = await axios.get(baseUrl + "getTags");
      let TB = await axios.get(baseUrl + `getBookTags?id=${props.bok?.id}`);
      setTags(T.data.Tags);
      setbookTags(TB.data.Tags);
    };
    m();
  }, [refreshTags]);

  let openBook = () => {
    window.open(
      "/read/" + props.bok.id,
      "_blank",
      "top=200,left=200,width=1000,frame=false,nodeIntegration=no"
    );
  };

  let DelBook = async () => {
    await axios.get(baseUrl + `delBook?id=${props.bok.id}`);
    props.fresh((d) => !d);
  };

  function addBookTag(ta) {
    let baseUrl = "http://localhost:3002/";
    let t = async () => {
      let d = await axios.post(
        baseUrl + "addBookTag",
        { id: props.bok["id"], Tag: ta },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };

    t();
    setrefreshTag((m) => !m);

    console.log(cover)
  }
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
            <div className=" space-y-2 items-start bg-gray-100 dark:text-gray-400 dark:bg-gray-800  border dark:border-gray-500 border-gray-300 shadow-lg dark:shadow-slate-500   rounded-lg  overflow-hidden  threeContent z-30 flex flex-col p-2">
              <div className=" flex  px-1 justify-between">
                <motion.div
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", duration: 0.2 }}
                  tabIndex={2}
                  className=" text-xl hover:text-2xl text-gray-400  "
                >
                  <Ai.AiFillHeart />
                </motion.div>
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
                <motion.div className=" flex flex-col space-x-2">
                  <div className=" flex flex-col items-center">
                    <motion.p className="  text-gray-500 whitespace-nowrap  ">
                      Add to Collection
                    </motion.p>
                    <div className=" mx-3 w-full bg-gray-100 opacity-20 border border-gray-500" />
                  </div>
                  {Tags.map((tag) => {
                    return (
                      <motion.p
                        key={tag}
                        onClick={() => addBookTag(tag)}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ ease: "easeIn", duration: 0.1 }}
                        className=" hover:bg-gray-700 px-2 py-1 rounded-lg"
                      >
                        {tag}
                      </motion.p>
                    );
                  })}
                </motion.div>

                <div className=" flex flex-col  w-full mb-1">
                  <motion.p className="  text-gray-500 whitespace-nowrap  ">
                    Tags
                  </motion.p>
                  <div className=" mx-3  bg-gray-100 opacity-20 border border-gray-500" />
                </div>
                <motion.div className="  whitespace-nowrap bg-gray-700 flex  flex-wrap rounded-xl p-2 space-y-1 ">
                  {bookTags.map((tag) => {
                    return (
                      <TagComp
                        key={tag}
                        fresh={setrefreshTag}
                        id={props.bok["id"]}
                        Tag={tag}
                      />
                    );
                  })}
                </motion.div>
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
          src={cover === "NotFound" ? logo : `data:image/jpeg;base64,${cover}`}
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

export const TagComp = (props) => {
  let baseUrl = "http://localhost:3002/";

  function cross() {
    let t = async () => {
      let d = await axios.post(
        baseUrl + "delBookTag",
        { id: props.id, Tag: props.Tag },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      props.fresh((m) => !m);
    };

    t();
  }

  return (
    <div>
      <motion.div className=" justify-between flex bg-green-600 rounded-lg items-center px-1 space-x-1 ">
        <motion.p
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ease: "easeIn", duration: 1 }}
          className="  text-sm text-gray-300   "
        >
          {props.Tag}
        </motion.p>
        <motion.div
          onClick={cross}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.2 }}
          className=" text-white"
        >
          <MdCancel />
        </motion.div>
      </motion.div>
    </div>
  );
};
