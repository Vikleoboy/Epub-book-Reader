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

export const MainSection = (props) => {
  return (
    <div className="p-1">
      <p className=" text-2xl  text-gray-600 dark:text-gray-300  ">
        Apple Books
      </p>

      <div>
        {props.allBtns.map((btn) => {
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
