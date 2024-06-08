import { BsBook } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { ModleAddTag } from "../Side.tsx";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoFolderOutline } from "react-icons/io5";
import { FaFolderPlus } from "react-icons/fa6";

export const Folders = (props) => {
  let baseUrl = "http://localhost:3002/";
  const [allBtns, setallBtns] = useState([]);

  const [AddTag, setAddTag] = useState(false);
  const [refreshTag, setrefreshTag] = useState(false);

  useEffect(() => {
    let t = async () => {
      let d = await axios.get(`${baseUrl}getTags`);
      console.log(d.data.Tags);
      setallBtns(d.data.Tags);
    };

    t();
  }, [refreshTag]);

  function handleAddFolder() {
    setAddTag(true);
    console.log("doing nothing ");
  }

  return (
    <>
      <div className="p-1">
        <div className="  flex justify-between items-center text-xl  text-gray-600 dark:text-gray-300  ">
          <p>Folders</p>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.5 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={handleAddFolder}
            className=" text-xl rounded-lg text-gray-300 "
          >
            <FaFolderPlus className=" w-4 h-4 " />
            {/* <button
              type="button"
              className="focus:outline-none w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3  py-1.5 mr-2 mb-2 dark:bg-blue-600/80 dark:hover:bg-blue-700/80 dark:focus:ring-blue-900"
            >
              Add
            </button> */}
          </motion.div>
        </div>

        <div className=" flex flex-col ">
          {allBtns.length !== 0 &&
            allBtns.map((btn) => {
              return (
                <div
                  onClick={() => {
                    console.log("we are here ");
                    props.setTagString(btn);
                  }}
                  key={btn}
                  tabIndex={0}
                  className="px-3 rounded-lg flex justify-between  hover:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800 focus:bg-gray-200 py-1 flex space-x-2  text-xl text-gray-500 dark:text-gray-400 items-center"
                >
                  <div className=" flex items-center space-x-2 ">
                    <p className=" text-blue-500 ">
                      <IoFolderOutline />
                    </p>
                    <div className=" flex items-center">
                      <p className=" text-lg overflow-x-hidden whitespace-nowrap  ">
                        {btn}
                      </p>
                    </div>
                  </div>
                  <SureDel fresh={setrefreshTag} Tag={btn} />
                </div>
              );
            })}
          {allBtns.length === 0 && (
            <div className=" p-7 text-lg text-gray-500 flex justify-center">
              Add New Collection
            </div>
          )}
        </div>
      </div>
      {AddTag && <ModleAddTag fresh={setrefreshTag} setAddModle={setAddTag} />}
    </>
  );
};

export const SureDel = (props) => {
  const [sureModal, setsureModal] = useState(false);
  let baseUrl = "http://localhost:3002/";
  function DelTag() {
    let t = async () => {
      await axios.get(baseUrl + `delTag?tagName=${props.Tag}`);
    };
    t();
    props.fresh((o) => !o);
    setsureModal(false);
  }

  return (
    <>
      <motion.div
        animate={{ rotate: 0 }}
        whileHover={{ rotate: [10, -10, 0], scale: 1.1 }}
        transition={{ duration: 0.2 }}
        onClick={() => setsureModal(true)}
        className=" text-lg  text-red-500 "
      >
        {/* <Gr.GrFormAdd /> */}

        <RiDeleteBinLine />
      </motion.div>
      {sureModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ ease: "easeIn", type: "spring", duration: 0.5 }}
          className=" fixed inset-0 flex items-center justify-center z-50"
        >
          <div
            tabIndex={2}
            className=" fixed inset-0 flex items-center justify-center z-50"
          >
            <div className=" p-10 dark:bg-gray-800/80 bg-gray-300 flex  flex-col justify-center items-center backdrop-blur-sm  rounded-lg p-10 px-7 space-y-10">
              <p className="opacity-100 text-3xl text-gray-300 ">
                Are you Sure ?
              </p>

              <div className=" w-full space-x-7 flex justify-between">
                <button
                  type="button"
                  onClick={() => setsureModal(false)}
                  className="focus:outline-none w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3  py-1.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Cancel
                </button>
                <button
                  onClick={DelTag}
                  type="button"
                  className="focus:outline-none w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3  py-1.5 mr-2 mb-2 dark:bg-blue-600/80 dark:hover:bg-blue-700/80 dark:focus:ring-blue-900"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};
