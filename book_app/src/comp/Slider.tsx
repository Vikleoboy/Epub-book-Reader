import { Search } from "./SideComp/Search.tsx";

export const Slider = (props) => {
  function handleChange(event) {
    localStorage.setItem("w", event.target.value);

    props.changeBookWidth(event.target.value);
  }

  return (
    <div className=" bg-gray-100 dark:bg-gray-900 shadow-inner rounded-lg mx-10 mt-4 border dark:border-gray-800 sticky bottom-0 flex justify-end pr-10 pl-2 py-2">
      <div className=" flex flex-col text-gray-500 ">
        <p>Size</p>
        <input
          id="default-range"
          type="range"
          min={10}
          max={60}
          value={props.val}
          onChange={handleChange}
          className=" w-30 h-2 bg-gray-200 dark:bg-gray-800 text-blue-500 border-cyan-500 slider rounded-lg appearance-none cursor-pointer "
        />
      </div>
    </div>
  );
};
