import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";

const Home = () => {
  return (
    <>
      <div className="grid grid-cols-[75%_250%] min-h-screen">
        <div className="">
          <Feed />
          <Outlet/>
        </div>
        <RightSidebar/>
      </div>
    </>
  );
};

export default Home;
