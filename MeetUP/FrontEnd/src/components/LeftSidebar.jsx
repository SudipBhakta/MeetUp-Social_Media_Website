import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusCircle,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import logo from "../../public/logo3.png";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
} from "../redux/authSlice";
import { setCurrentPost, setPosts } from "../redux/postSlice";

function Sidebar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const items = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Message" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusCircle />, text: "Post" },
    {
      icon: (
        <div className="avatar">
          <div className="w-8 ring-2 rounded-full  ring-blue-800">
            <img
              src={
                user?.avatar ||
                "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
              }
            />
          </div>
        </div>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
        dispatch(setAuthUser(null));
        dispatch(setSuggestedUsers(null));
        dispatch(setUserProfile(null));
        dispatch(setPosts(null));
        dispatch(setCurrentPost(null));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const sidebarHandler = (text) => {
    if (text === "Logout") {
      logout();
    } else if (text === "Post") {
      document.getElementById("my_modal_4").showModal();
    } else if (text === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (text === "Home") {
      navigate("/");
    }
  };
  return (
    <div className=" fixed   z-0 left-0 py-10 ml-[2%]  rounded-xl px-2 bg-white border border-gray-300 w-[22%]  h-screen">
      <div className="flex h-10 mb-12 justify-center">
        <img className="w-10 h-10" src={logo} alt="" />
        <h1 className="text-4xl font-bold text-blue-700">eetup</h1>
      </div>
      <div className="flex flex-col pl-12">
        {items.map((item) => (
          <div
            onClick={() => sidebarHandler(item.text)}
            key={item.text}
            className="flex items-center relative my-2 py-2 px-4 hover:text-white hover:bg-blue-500 cursor-pointer"
          >
            {item.icon}
            <span className="ml-2">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
