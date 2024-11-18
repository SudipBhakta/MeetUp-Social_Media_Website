import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { Toaster } from "react-hot-toast";
import SignUpAndLogin from "./components/signupAndLogin";
import Home from "./components/Home";
import Profile from "./components/Profile";
import MainLayout from "./components/mainlayout/MainLayout";
import EditProfile from "./components/EditProfile";
import MessagePage from "./components/MessagePage";
import { setOnlineUsers} from "./redux/chatSlice";
import { setSocket } from "./redux/socketSlic.js";

function App() {
    const { user } = useSelector(store => store.auth);
    const { socket } = useSelector(store => store.socket);
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (user) {
        const socketio = io('http://localhost:4000', {
          query: {
            userId: user?._id
          },
          transports: ['websocket']
        });
        dispatch(setSocket(socketio));
  
        socketio.on('onlineUsers', (onlineUsers) => {
          dispatch(setOnlineUsers(onlineUsers));
        });
  
        socketio.on('notification', (notification) => {
          dispatch(setLikeNotification(notification));
        });
  
        return () => {
          socketio.close();
          dispatch(setSocket(null));
        }
      } else if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }, [user, dispatch]);
  

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/message" element={<MessagePage />} />
        </Route>
        <Route path="/login" element={<SignUpAndLogin />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
