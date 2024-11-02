import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../LeftSidebar";

const MainLayout = () => {
  return (
    <div className="grid grid-cols-[22%_78%] bg-slate-100 min-h-screen ">
      <div>
        <LeftSidebar />
      </div>
      
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;