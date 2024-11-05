import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import CreatPost from "./CreatPost";
import { useSelector } from "react-redux";
import getAllPosts from "../hooks/getAllPosts";

const Feed = () => {
  getAllPosts()
  const { user } = useSelector((store) => store.auth);
  const {posts}= useSelector((store)=>store.posts)
  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="flex rounded-md bg-white w-[78%] p-3 mr-2 mb-3 border-2">
          <div className="avatar">
            <div className="w-10 h-10 ring-2 ring-blue-700 rounded-full">
              <img src={user?.avatar} alt="User avatar" />
            </div>
          </div>
          <div className="ml-3 w-full">
            <button
              className="h-12 rounded-full border border-slate-400 hover:bg-blue-50 hover:border-blue-300 w-[90%] p-3 text-left font-semibold text-gray-400 hover:text-blue-600"
              onClick={() => document.getElementById("my_modal_4").showModal()}
            >
              Create your Post...
            </button>
          </div>
        </div>
        <CreatPost />

        {posts.map((post) => (
          <PostCard post={post} key={post._id} />
        ))}
      </div>
    </>
  );
};

export default Feed;
