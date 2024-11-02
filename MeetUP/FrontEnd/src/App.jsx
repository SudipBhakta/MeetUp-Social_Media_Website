import React from "react";
import SignUpAndLogin from "./components/signupAndLogin";
import { Toaster } from "react-hot-toast";
import {  Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import MainLayout from "./components/mainlayout/Mainlayout";
import Profile from "./components/Profile";

function App() {
  return (
    <>
     <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<SignUpAndLogin />} />
        <Route path="/signup" element={<SignUpAndLogin />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;


