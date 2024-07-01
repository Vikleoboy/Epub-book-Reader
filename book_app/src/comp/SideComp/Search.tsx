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
    <div className = "search-bar w-[170px] ml-[-11px]">
    <div>
  <div></div>
  <IonSearchbar
    value={props.SearchKey}
    onIonInput={handleChange}
    animated={true}
    placeholder="Search"
    style={{
      width: '100%' 
    }}
  ></IonSearchbar>
</div>
</div>

  );
};
