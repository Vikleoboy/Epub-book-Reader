import {
  IonApp,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonSearchbar,
  IonTitle,
} from "@ionic/react";
import { BsBook } from "react-icons/bs";
import { FaBookOpenReader } from "react-icons/fa6";

import { IoBookmark } from "react-icons/io5";

export const MainSection = (props) => {
  return (
    <div className="   p-1">
      <p className=" text-xl  text-gray-600 dark:text-gray-300  ">
        Axiom Books
      </p>

      <div className=" pl-2">
        <div
          onClick={() => props.setTagString("")}
          tabIndex={0}
          className="px-1 rounded-lg  hover:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800 focus:bg-gray-200 py-1 flex space-x-2  text-xl text-gray-500 dark:text-gray-400 items-center"
        >
          <p className=" text-yellow-500 ">
            <BsBook />
          </p>
          <p className=" text-lg">All Books</p>
        </div>
      </div>
      <div className=" pl-2">
        <div
          tabIndex={0}
          className="px-1 rounded-lg  hover:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800 focus:bg-gray-200 py-1 flex space-x-2  text-xl text-gray-500 dark:text-gray-400 items-center"
        >
          <p className=" text-blue-500 ">
            <FaBookOpenReader />
          </p>
          <p className=" text-lg">Reading Now</p>
        </div>
      </div>
      <div className=" pl-2">
        <div
          tabIndex={0}
          className="px-1 rounded-lg  hover:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800 focus:bg-gray-200 py-1 flex space-x-2  text-xl text-gray-500 dark:text-gray-400 items-center"
        >
          <p className=" text-red-400 ">
            <IoBookmark />
          </p>
          <p className=" text-lg">BookMarks</p>
        </div>
      </div>
    </div>
  );
};
