import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import CreatPostDialog from "./CreatPostDialog";
import { useSelector } from "react-redux";
import getAllPosts from "../hooks/getAllPosts";
import { Link } from "react-router-dom";

const Feed = () => {
  getAllPosts();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);
  return (
    <>
      <div className="flex flex-col ml-2 ">
        <div className="flex rounded-md bg-white w-[95%] p-3 mr-2 mb-3 border-2">
          <Link to={`/profile/${user?._id}`}>
            <div className="avatar">
              <div className="w-10 h-10 ring-2 ring-blue-700 rounded-full">
                <img
                  src={
                    user?.avatar ||
                    "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
                  }
                  alt="User avatar"
                />
              </div>
            </div>
          </Link>

          <div className="ml-3 w-full">
            <button
              className="h-12 rounded-full border border-slate-400 hover:bg-blue-50 hover:border-blue-300 w-[90%] p-3 text-left font-semibold text-gray-400 hover:text-blue-600"
              onClick={() => document.getElementById("my_modal_4").showModal()}
            >
              Create your Post...
            </button>
          </div>
        </div>
        <CreatPostDialog />
        {posts.map((post) => (
          <PostCard post={post} key={post._id} />
        ))}
      </div>
    </>
  );
};

export default Feed;
