import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../LeftSidebar";
import Navbar from "../Navbar";
import CreatePost from "../CreatPostDialog";

const MainLayout = () => {
  return (
    <>
    <Navbar/>
      <div className="grid grid-cols-[22%_78%] m-20">
        <div>
          <LeftSidebar />
        </div>
        <div>
          <Outlet />
        </div>
        <CreatePost />
      </div>
    </>
  );
};

export default MainLayout;
