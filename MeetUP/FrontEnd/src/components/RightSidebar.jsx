import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser.jsx";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className=" fixed flex flex-col    right-0 mr-6 z-0   rounded-xl border bg-white border-gray-300 w-[25%]  h-screen">
      <div className="flex flex-col m-2 space-y-2 p-4 h-[20%] justify-center rounded-md items-center border-2  ">
        <Link to={`/profile/${user?._id}`}>
          {" "}
          <div className="avatar ">
            <div className=" w-12 h-12 ring-2 ring-blue-700 rounded-full">
              <img
                src={
                  user.avatar ||
                  "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
                }
                alt={user.username}
              />
            </div>
          </div>
        </Link>
        <Link to={`/profile/${user?._id}`}>
          <h2 className="text-2xl font-semibold ">{user.username}</h2>
        </Link>
        <p>{user?.bio}</p>
      </div>
      <SuggestedUser />
    </div>
  );
};

export default RightSidebar;
