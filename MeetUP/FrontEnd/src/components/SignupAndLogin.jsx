// Slidig signup and login page
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice.js";

function SignUpAndLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [signupInput, setSignUpInput] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // signup logic
  const signupHandleChange = (e) => {
    setSignUpInput({ ...signupInput, [e.target.name]: e.target.value });
  };
  const signupHandeler = async (e) => {
    e.preventDefault();
    console.log(signupInput);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/signup",
        signupInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          toggleForm();
        }, 2000);
        setInput({
          email: "",
          username: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      +setLoading(false);
    }
  };
  // login logic
  const loginHandleChange = (e) => {
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
  };
  const loginHandeler = async (e) => {
    e.preventDefault();
    console.log(loginInput);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        loginInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-96 h-96 bg-white shadow-md rounded-md overflow-hidden">
        <div
          className={`absolute inset-0 transform transition-transform duration-500 ${
            isLogin ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Login Form */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <form onSubmit={loginHandeler}>
              <input
                type="email"
                name="email"
                value={loginInput.email}
                onChange={loginHandleChange}
                placeholder="Email"
                className="w-full mb-4 p-2 border focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
              />
              <input
                type="password"
                name="password"
                value={loginInput.password}
                onChange={loginHandleChange}
                placeholder="Password"
                className="w-full mb-4 p-2 border focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
              />
              <div>
                {loading ? (
                  <button className="w-full h-10 bg-blue-500 text-white justify rounded-md ">
                    <span className="loading loading-spinner text-accent"></span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md"
                  >
                    Login
                  </button>
                )}
              </div>
            </form>
            <p className="text-sm mt-4 text-center">
              Don't have an account?{" "}
              <span
                onClick={toggleForm}
                className="text-blue-500 cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>

        <div
          className={`absolute inset-0 transform transition-transform duration-500 ${
            isLogin ? "translate-x-full" : "translate-x-0"
          }`}
        >
          {/* Signup Form */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
            <form onSubmit={signupHandeler}>
              <input
                type="text"
                name="username"
                value={signupInput.username}
                onChange={signupHandleChange}
                placeholder="User Name"
                className="w-full mb-4 p-2 border focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={signupInput.email}
                onChange={signupHandleChange}
                className="w-full mb-4 p-2 border focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={signupInput.password}
                onChange={signupHandleChange}
                className="w-full mb-4 p-2 border focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
              />
              <div>
                {loading ? (
                  <button className="w-full h-10 bg-blue-500 text-white justify rounded-md">
                    <span className="loading loading-spinner text-accent"></span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md"
                  >
                    Signup
                  </button>
                )}
              </div>
            </form>
            <p className="text-sm mt-4 text-center">
              Already have an account?{" "}
              <span
                onClick={toggleForm}
                className="text-blue-500 cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpAndLogin;
