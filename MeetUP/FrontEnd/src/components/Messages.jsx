import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import getAllMessages from "../hooks/getAllMessages";
import realTimeMessage from "../hooks/realTimeMessag";

const Messages = ({ selectedUser }) => {
  getAllMessages();
  realTimeMessage();

  const { user } = useSelector((store) => store.auth);
  const { messages } = useSelector((store) => store.chat);

  return (
    <>
      <div className="overflow-y-auto flex-1 p-4 scrollbar-hide">
        <div className="flex justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="avatar p-1 mb-3">
              <div className="w-20 h-20 ring-2 rounded-full ring-blue-800">
                <img
                  src={
                    selectedUser?.avatar ||
                    "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
                  }
                />
              </div>
            </div>
            <span className="font-medium text-xl">{selectedUser?.username}</span>
            <span className="mb-3">{selectedUser?.bio}</span>
            <Link to={`/profile/${selectedUser?._id}`}>
              <button className="bg-blue-700 text-white px-2 py-1 rounded-md">
                View Profile
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3 ">
          {messages &&
            messages.map((message) => {
              return (
                <div
                  key={message._id}
                  className={`flex ${message?.sender === user?._id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 rounded-lg text-md text-white max-w-[80%] ${
                      message?.sender === user?._id ? "bg-blue-700" : "bg-gray-800"
                    }`}
                  >
                    {message.message}
                    <span></span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Messages;
