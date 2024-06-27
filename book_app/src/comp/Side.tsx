import { useState } from "react";
import { Search } from "./SideComp/Search.tsx";
import { MainSection } from "./SideComp/MainSection.tsx";
import { Folders } from "./SideComp/Folders.tsx";

import axios from "axios";

export const Side = (props) => {
  const [AddModle, setAddModle] = useState(false);
  let url = "http://localhost:3002/";
  let allBtns = ["Library", "Collaction", "Saved", "Liked"];

  const quit = () => {
    axios.get(url + "quit");
  };

  return (
    <div className=" col-span-1  p-7 bg-gray-100 border border-gray-800 dark:bg-gray-900 w-full rounded-md">
      <div className=" flex flex-col space-y-10 ">
        <div className=" relative flex ml-2">
          <div onClick={quit} className="mac-button mac-quit"></div>
          <div className="mac-button mac-minimize"></div>
          <div className="mac-button mac-maximize"></div>
        </div>

        <Search SearchKey={props.SearchKey} setSearchKey={props.setSearchKey} />

        <MainSection setTagString={props.setTagString} allBtns={allBtns} />
        <Folders
          setTagString={props.setTagString}
          setFresh={props.setFresh}
          allBtns={allBtns}
          AddModle={AddModle}
          setAddModle={setAddModle}
        />
      </div>
    </div>
  );
};

export const ModleAddTag = (props) => {
  const [tagName, settagName] = useState("");
  const url = "http://localhost:3002/";
  const [Status, setStatus] = useState(false);
  const [loading, setloading] = useState(false);
  const inchange = (event) => {
    settagName(event.target.value);
  };

  const handleAdd = async () => {
    setloading(true);
    let d = await axios.get(url + "addTag?tagName=" + tagName);

    if (d.data?.res === "NVP") {
      setStatus(true);
      setloading(false);
    }

    if (d.data === "Done") {
      setloading(true);
    }

    if (d.data?.res === "Done") {
      props.setAddModle(false);
      props.fresh((f) => !f);
    }
  };

  return (
    <div
      tabIndex={2}
      className=" fixed inset-0 flex items-center justify-center z-50"
    >
      {!loading && (
        <div className=" p-10 dark:bg-gray-800/80 bg-gray-300 flex  flex-col justify-center items-center backdrop-blur-sm  rounded-lg p-10 px-7 space-y-7">
          <p className="opacity-100 text-3xl text-gray-300 ">
            Name of Collection
          </p>
          <div className=" flex flex-col space-y-2">
            <input
              onChange={inchange}
              type="text"
              className=" backdrop-blur-sm  py-1 pl-6 text-xl transition-all duration-200  dark:focus:outline-gray-400 dark:hover:outline-gray-600 rounded-md ch w-full bg-gray-200 dark:bg-gray-700/5 pl-4  dark:text-gray-400   placeholder-gray-400 dark:placeholder-gray-500 outline-none   "
              name=""
              placeholder="Name of the Tag"
              id=""
            />
            {Status && (
              <p className=" px-2 dark:text-red-500 ">Tag Alredy Exists</p>
            )}
          </div>

          <div className=" w-full space-x-7 flex justify-between">
            <button
              type="button"
              onClick={() => props.setAddModle(false)}
              className="focus:outline-none w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3  py-1.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              type="button"
              className="focus:outline-none w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3  py-1.5 mr-2 mb-2 dark:bg-blue-600/80 dark:hover:bg-blue-700/80 dark:focus:ring-blue-900"
            >
              Add
            </button>
          </div>
        </div>
      )}
      {loading && (
        <p className=" text-2xl p-10 dark:bg-gray-800/80 bg-gray-300 flex  flex-col justify-center items-center backdrop-blur-sm  rounded-lg p-10 px-7 space-y-7">
          Loading ...
        </p>
      )}
    </div>
  );
};

export const ModleAdd = (props) => {
  const [path, setpath] = useState("");
  const url = "http://localhost:3002/";
  const [Status, setStatus] = useState(false);
  const [loading, setloading] = useState(false);
  const inchange = (event) => {
    setpath(event.target.value);
  };

  const handleAdd = async () => {
    setloading(true);
    let d = await axios.get(url + "addFolder?path=" + path);

    if (d.data?.res === "NVP") {
      setStatus(true);
      setloading(false);
    }

    if (d.data === "Done") {
      setloading(true);
    }

    await axios.get(url + "allBooks");
    if (d.data?.res === "Done") {
      props.setAddModle(false);
      props.fresh((f) => !f);
    }
  };

  return (
    <div
      tabIndex={2}
      className=" fixed inset-0 flex items-center justify-center z-50"
    >
      {!loading && (
        <div className=" p-10 dark:bg-gray-800/80 bg-gray-300 flex  flex-col justify-center items-center backdrop-blur-sm  rounded-lg p-10 px-7 space-y-7">
          <p className="opacity-100 text-3xl text-gray-300 ">
            Select the Folder
          </p>
          <div className=" flex flex-col space-y-2">
            <input
              onChange={inchange}
              type="text"
              className=" backdrop-blur-sm  py-1 pl-6 text-xl transition-all duration-200  dark:focus:outline-gray-400 dark:hover:outline-gray-600 rounded-md ch w-full bg-gray-200 dark:bg-gray-700/5 pl-4  dark:text-gray-400   placeholder-gray-400 dark:placeholder-gray-500 outline-none   "
              name=""
              placeholder=" Path to the Folder"
              id=""
            />
            {Status && (
              <p className=" px-2 dark:text-red-500 ">Not Valid Path</p>
            )}
          </div>

          <div className=" w-full space-x-7 flex justify-between">
            <button
              type="button"
              onClick={() => props.setAddModle(false)}
              className="focus:outline-none w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3  py-1.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              type="button"
              className="focus:outline-none w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3  py-1.5 mr-2 mb-2 dark:bg-blue-600/80 dark:hover:bg-blue-700/80 dark:focus:ring-blue-900"
            >
              Add
            </button>
          </div>
        </div>
      )}
      {loading && (
        <p className=" text-2xl p-10 dark:bg-gray-800/80 bg-gray-300 flex  flex-col justify-center items-center backdrop-blur-sm  rounded-lg p-10 px-7 space-y-7">
          Loading ...
        </p>
      )}
    </div>
  );
};
