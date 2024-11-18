import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, setSelectedUser } from "../redux/chatSlice";
import Messages from "./Messages";
import axios from "axios";
import {MessageCircleCode } from "lucide-react";

const MessagePage = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const { selectedUser, onlineUsers, messages } = useSelector(
    (store) => store.chat
  );
  const dispatch = useDispatch();
  const [textMessage, setTextMessage] = useState("");

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/message/sendMessage/${selectedUser?._id}`,
        { message: textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen fixed w-[74%] rounded-md border">
      <section className="w-[23%] border-r">
        <div className="h-[80vh]">
          {suggestedUsers?.map((suggestedUser) => {
            const isOnline = onlineUsers?.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-2 hover:bg-gray-50 cursor-pointer"
              >
                <div className="avatar p-1">
                  <div className="w-12 h-12 ring-2 rounded-full ring-blue-800">
                    <img
                      src={
                        suggestedUser?.avatar ||
                        "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg"
                      }
                      alt={suggestedUser?.username}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-2xl">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs ${isOnline ? "text-green-600" : "text-red-600"}`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-2 pb-1 border-b border-b-gray-300 sticky top-0 bg-white z-50">
            <div className="avatar p-1">
              <div className="w-12 h-12 ring-2 rounded-full ring-blue-800">
                <img
                  src={
                    selectedUser?.avatar ||
                    "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg"
                  }
                  alt={selectedUser?.username}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-2xl">{selectedUser?.username}</span>
            </div>
          </div>
          <div className="overflow-y-auto h-full p-2 scrollbar-none">
            <Messages selectedUser={selectedUser} />
          </div>

          <div className="flex gap-3 px-4 py-2 mb-2">
            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              placeholder="Type a message"
              className="input input-bordered focus:outline-none input-sm w-full"
            />
            <button
              onClick={sendMessageHandler}
              className="btn btn-primary btn-sm"
            >
              Send
            </button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col justify-center items-center flex-1">
          <MessageCircleCode className="w-40 h-40 text-blue-600"/>
          <span className="font-semibold text-2xl">No Message</span>
          <h2>Select a user to start chatting!</h2>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
