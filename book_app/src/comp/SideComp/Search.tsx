import { IonContent, IonSearchbar, ToggleCustomEvent } from "@ionic/react";
import { useState, useRef, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import "../../theme/variables.css";
export const Search = (props) => {
  const [clicked, setclicked] = useState(false);
  const [text, settext] = useState("");
  const inp = useRef();
  const [word, setword] = useState("");

  const [themeToggle, setThemeToggle] = useState(true);

  // Listen for the toggle check/uncheck to toggle the dark theme
  const toggleChange = (ev: ToggleCustomEvent) => {
    toggleDarkTheme(ev.detail.checked);
  };

  // Add or remove the "dark" class on the document body
  const toggleDarkTheme = (shouldAdd: boolean) => {
    document.body.classList.toggle("dark", shouldAdd);
  };

  // Check/uncheck the toggle and update the theme based on isDark
  const initializeDarkTheme = (isDark: boolean) => {
    setThemeToggle(isDark);
    toggleDarkTheme(isDark);
  };

  useEffect(() => {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    // Initialize the dark theme based on the initial
    // value of the prefers-color-scheme media query
    initializeDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener("change", (mediaQuery) =>
      initializeDarkTheme(mediaQuery.matches)
    );
  }, []);

  function handleClick() {
    setclicked(true);
    inp.current.click();
  }

  function changeParentStyles() {
    const parent = document.querySelector(".parent");
    parent.classList.add("dark:bg-red-500");
    // Add any other style changes to the parent element here
  }

  function handleChange(event) {
    props.setSearchKey(event.target.value);
  }
  console.log(props.SearchKey);
  return (
    <div>
      <div></div>
      <IonSearchbar
        value={props.SearchKey}
        onIonInput={handleChange}
        animated={true}
        placeholder="Search"
      ></IonSearchbar>
    </div>
  );
};

// <div
// tabIndex={10}
// id="parent"
// className="relative     w-full text-lg   flex space-x-2 items-center"
// >
// <BsSearch className=" text-gray-400 absolute left-4" />
// <input
//   tabIndex={1}
//   className="  py-1 pl-6 text-xl transition-all duration-200  dark:focus:outline-gray-400 dark:hover:outline-gray-600 rounded-md ch w-full bg-gray-200 dark:bg-gray-800 pl-4 text-gray-500 dark:text-gray-400   placeholder-gray-500 dark:placeholder-gray-500 outline-none   "
//   placeholder="  Search"
//   ref={inp}
//   type="text"
//   name=""
//   id="child"
// />
// </div>
