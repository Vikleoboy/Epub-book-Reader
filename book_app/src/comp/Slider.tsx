import { Search } from "./SideComp/Search.tsx";
import { useState } from "react";
import axios from "axios";

export const Slider = (props) => {
  const [modalFolder, setmodalFolder] = useState(false);
  const [modalBook, setmodalBook] = useState(false);

  function handleChange(event) {
    localStorage.setItem("w", event.target.value);
    props.changeBookWidth(event.target.value);
  }

  return (
    <>
      <div className="   mx-8  flex justify-between items-center bg-gray-100 dark:bg-gray-900 shadow-inner rounded-lg  mt-4 border dark:border-gray-800 sticky bottom  px-8  py-5">
        <div className="   flex justify-center items-center ">
          {/* <p>Size</p> */}

          <input
            id="default-range"
            type="range"
            min={10}
            max={25}
            value={props.val}
            onChange={handleChange}
            className=" w-30 h-2 bg-gray-200 dark:bg-gray-800 text-blue-500 border-cyan-500 slider rounded-lg appearance-none cursor-pointer "
          />
        </div>

        <div className="flex space-x-3 justify-center items-center">
          <button
            onClick={() => setmodalBook(true)}
            className="focus:outline-none  text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3  py-1.5   dark:bg-blue-600/80 dark:hover:bg-blue-700/80 dark:focus:ring-blue-900"
          >
            Add Book
          </button>
          <button
            onClick={() => setmodalFolder(true)}
            className="focus:outline-none  text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3  py-1.5   dark:bg-blue-600/80 dark:hover:bg-blue-700/80 dark:focus:ring-blue-900"
          >
            Add Folder
          </button>
        </div>
      </div>
      {modalFolder && (
        <ModaleAddFolder refresh={props.refresh} setAddModle={setmodalFolder} />
      )}
      {modalBook && (
        <ModaleAddBook refresh={props.refresh} setAddModle={setmodalBook} />
      )}
    </>
  );
};

export const ModaleAddFolder = (props) => {
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
    console.log(d.data.res);
    if (d.data.res === "Done") {
      setloading(true);
    }

    console.log(d.data.res);
    if (d.data.res === "Done") {
      props.setAddModle(false);
      props.refresh((f) => !f);
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

export const ModaleAddBook = (props) => {
  const [path, setpath] = useState("");
  const url = "http://localhost:3002/";
  const [Status, setStatus] = useState(false);
  const [loading, setloading] = useState(false);
  const inchange = (event) => {
    setpath(event.target.value);
  };

  const handleAdd = () => {
    let f = async () => {
      setloading(true);
      let d = await axios.post(
        url + "addBook/",
        { pm: path },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(d.data.res);
      if (d.data.res === "NVP") {
        setStatus(true);
        setloading(false);
      }

      if (d.data.res === "Done") {
        setloading(true);
        props.setAddModle(false);
        props.refresh((f) => !f);
      }
    };
    f();
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
