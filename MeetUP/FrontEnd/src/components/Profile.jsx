import React, { useState } from "react";
import getUserProfile from "../hooks/getUserProfile";
import {  Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart, MessageCircle } from "lucide-react";

function Profile() {
  const params = useParams();
  const userId = params.id;
  getUserProfile(userId);
  const { userProfile, user } = useSelector((stor) => stor.auth);
  const isFollow = true;
  const [activeTab, setActiveTab] = useState("post");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const userPosts =
    activeTab === "post" ? userProfile?.posts : userProfile?.savedPosts;
  return (
    <>
      <div className="w-full ml-8  flex flex-col gap-5 mx-auto items-center justify-center">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <section className="flex justify-center  items-center">
            <div className="avatar">
              <div className="w-36 h-36 ring-2 rounded-full  ring-blue-800">
                <img
                  src={
                    userProfile?.avatar ||
                    "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
                  }
                />
              </div>
            </div>
          </section>
          <section className="pt-4 ">
            <div className="flex flex-col gap-3">
              <div className="flex gap-5">
                <h1 className="text-2xl font-bold">{userProfile?.username}</h1>
                {user?._id === userProfile?._id ? (
                  <Link to="/editprofile"> <button
                    className="bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded text-white"
                  >
                    Edit Profile
                  </button></Link>
                 
                ) : (
                  ""
                )}
              </div>

              <p>{userProfile?.bio}</p>
              <div className="flex gap-3">
                <p>Posts: {userProfile?.posts?.length}</p>
                <p>Followers: {userProfile?.followers?.length}</p>
                <p>Following: {userProfile?.followings?.length}</p>
              </div>
              <div>
                {user?._id !== userProfile?._id ? (
                  isFollow ? (
                    <div className=" flex gap-5">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                        Unfollow
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                        Message
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py- px-4 rounded"
                        onClick={() => handleTabChange("post")}
                      >
                        Follow
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py- px-4 rounded">
                        Message
                      </button>
                    </div>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </section>
        </div>
        <div className="w-full">
          <div className=" mb-1 w-full flex border-b-2 pb-1  items-center justify-center">
            <span
              className={`w-full flex border-2 justify-center ${
                activeTab === "post" ? `bg-slate-300 font-semibold` : ""
              } `}
              onClick={() => setActiveTab("post")}
            >
              Posts
            </span>
            <span
              className={`w-full flex border-2 justify-center ${
                activeTab === "savePost" ? `bg-slate-300 font-semibold` : ""
              } `}
              onClick={() => setActiveTab("savePost")}
            >
              Saved Post
            </span>
          </div>
          <div className="w-full grid grid-cols-3">
            {userPosts?.map((post) => (
              <div
                key={post._id}
                className="w-full h-80 flex justify-between  "
              >
                <div className="flex gap-5 border-4 border-white rounded-md bg-slate-900 relative ">
                  <img
                    src={post.image}
                    alt="Post Image"
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0  hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4 justify-center">
                      <button className="flex">
                        <Heart />
                        <span>{post.likes.length}</span>
                      </button>
                      <button className="flex">
                        <MessageCircle />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default Profile;
