import { Side } from "../comp/Side.tsx";
import { WorkArea } from "../comp/WorkArea.tsx";

export const MainPage = () => {
  return (
    <div className=" bg-[#ffffff] dark:bg-gray-950 w-[100vw] h-[100vh] flex ">
      <Side />
      <WorkArea />
    </div>
  );
};
