import { Side } from "../comp/Side.tsx";
import { WorkArea } from "../comp/WorkArea.tsx";

export const MainPage = () => {
  return (
    <div
      style={{ display: "grid", gridAutoRows: "minmax(100vh,100vh)" }}
      className="grid   grid-cols-7  dark:bg-gray-950 w-[100%] h-[100vh] overflow-y-hidden  "
    >
      <Side />
      <WorkArea />
      {/* <div className=" bg-slate-200">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur
        debitis obcaecati voluptatibus perferendis consequatur quam repudiandae
        illo tempore odit accusantium, saepe odio quibusdam reprehenderit quasi
        autem non et maiores error.
      </div>
      <div className=" bg-slate-200">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur
        debitis obcaecati voluptatibus perferendis consequatur quam repudiandae
        illo tempore odit accusantium, saepe odio quibusdam reprehenderit quasi
        autem non et maiores error.
      </div> */}
    </div>
  );
};
