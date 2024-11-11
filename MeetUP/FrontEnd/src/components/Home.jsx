import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import getSuggestedUser from "../hooks/getSuggestedUser";
import getAllPosts from "../hooks/getAllPosts";

const Home = () => {
  getSuggestedUser();
  getAllPosts();
  return (
    <>
      <div className="grid grid-cols-[70%_30%] max-h-full ">
        <div className="">
          <Feed />
          <Outlet />
        </div>
        <div>
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Home;
