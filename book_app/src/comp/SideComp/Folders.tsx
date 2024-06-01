import { BsBook } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { ModleAdd } from "../Side.tsx";

export const Folders = (props) => {
  const AddModle = props.AddModle;
  const setAddModle = props.setAddModle;
  const allBtns = props.allBtns;

  function handleAddFolder() {
    setAddModle(false);
  }

  return (
    <div className="p-1">
      <div className="  flex justify-between items-center text-2xl  text-gray-600 dark:text-gray-300  ">
        <p>Folders</p>
        <div
          onClick={() => setAddModle(true)}
          className="border-2 border-gray-500 rounded-lg text-gray-300 "
        >
          <IoMdAdd className="   w-4 h-4 text-gray-300" />
        </div>
      </div>
      {AddModle && <ModleAdd setAddModle={setAddModle} />}
      <div>
        {allBtns.map((btn) => {
          return (
            <div
              tabIndex={0}
              className="px-1 rounded-lg  hover:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800 focus:bg-gray-200 py-1 flex space-x-2  text-xl text-gray-500 dark:text-gray-400 items-center"
            >
              <p className=" text-blue-500 ">
                <BsBook />
              </p>
              <p>{btn}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
