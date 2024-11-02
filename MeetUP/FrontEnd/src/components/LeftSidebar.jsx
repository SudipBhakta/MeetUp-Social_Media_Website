import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusCircle,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import logo from "../../public/logo3.png";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
        <div className="w-8 rounded-full">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
    ),
    text: "Profile",
  },
  { icon: <LogOut />, text: "Logout" },
];
function Sidebar() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const sidebarHandler = (text) => {
    if (text === "Logout") {
      logout();
    }
  };
  return (
    <div className=" fixed  top-0 z-10 left-0 py-10 ml-16 mt-8 rounded-xl px-2 bg-white border border-gray-300 w-[22%]  h-screen">
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
