import React from "react";
import SignUpAndLogin from "./components/signupAndLogin";
import { Toaster } from "react-hot-toast";
import {  Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import MainLayout from "./components/mainlayout/MainLayout";
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <>
     <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/editprofile" element={<EditProfile />} />

        </Route>
        <Route path="/login" element={<SignUpAndLogin />} />        

      </Routes>
      <Toaster />
    </>
  );
}

export default App;


