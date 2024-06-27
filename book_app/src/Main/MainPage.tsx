import { Side } from "../comp/Side.tsx";
import { WorkArea } from "../comp/WorkArea.tsx";
import { useState } from "react";
export const MainPage = () => {
  const [TagString, setTagString] = useState("");
  const [SearchKey, setSearchKey] = useState("");
  console.log(SearchKey, "here");
  return (
    <div
      style={{ display: "grid", gridAutoRows: "minmax(100vh,100vh)" }}
      className="grid   grid-cols-7  dark:bg-gray-950 w-[100%] h-[100vh] overflow-y-hidden  "
    >
      <Side
        className=" sm:hidden"
        SearchKey={SearchKey}
        setSearchKey={setSearchKey}
        setTagString={setTagString}
      />
      <WorkArea keyword={SearchKey} TagString={TagString} />
    </div>
  );
};
