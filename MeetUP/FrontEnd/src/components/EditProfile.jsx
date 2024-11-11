import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    avatar: user?.avatar,
    username: user?.username,
    bio: user?.bio,
    gender: user?.gender,
  });
const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
     setFormData({...formData, avatar:file})
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const nameChangeHandler = (e) => {
    const text = e.target.value;
    if (text) setFormData({ ...formData, username: text });
  };
  const bioChangeHandler = (e) => {
    const text = e.target.value;
    if (text) setFormData({ ...formData, bio: text });
  };
  const genderChangeHandler = (e) => {
    const value = e.target.value;
    if (value) setFormData({ ...formData, gender: value });
  };
  const editProfileHandler = async () => {
    console.log(formData);
    const inputForm = new FormData();
    inputForm.append("username", formData.username);
    inputForm.append("bio", formData.bio);
    inputForm.append("gender", formData.gender);
    if (formData.avatar) {
      inputForm.append("avatar", formData.avatar);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/profile/edit",
        inputForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Profile updated successfully");
        setFormData({
          avatar: "",
          username: "",
          bio: "",
          gender: "",
        })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ml-10">
        <h1 className="font-bold  text-2xl">Edit Profile</h1>
        <div className="flex flex-col m-2 space-y-2 w-full p-4 h-[20%] justify-center rounded-md items-center">
          <div className="flex gap-20">
            <div className="avatar">
              <div className="w-36 h-36 ring-2 ring-blue-700 rounded-full">
                <img
                  src={
                    imagePreview ||
                    user.avatar ||
                    "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
                  }
                  alt={user?.username}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <input
              ref={imageRef}
              type="file"
              onChange={fileChangeHandler}
              className="hidden"
            />
            <button
              onClick={() => imageRef?.current.click()}
              className="bg-blue-600 mt-24 h-10 px-2 py-1 rounded-md text-white font-semibold"
            >
              Change Photo
            </button>
          </div>
          <div className="w-[60%]">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              User Name<span className="text-xs ml-2 text-red-400">*(Must be unique)</span>
            </label>
            <textarea
            value={formData.username}
              onChange={nameChangeHandler}
              placeholder={user?.username || "User Name"}
              className="w-full h-12 border-none ring-1 p-2 max-h-full font-semibold text-xl focus:outline-none block resize-none rounded-md"
            />
          </div>
          <div className="w-[60%]">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={bioChangeHandler}
              placeholder={user?.bio || "Write something about yourself..."}
              className="w-full h-20 border-none ring-1 p-2 max-h-full focus:outline-none block resize-none rounded-md"
            />
          </div>
          <div className="w-[60%]">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={genderChangeHandler}
              className="select select-bordered w-full max-w-xs"
            >
              <option disabled selected={!formData.gender}>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="w-[60%] flex justify-end">
            {loading ? (
              <button className="bg-blue-600 mt-8 w-32 h-10 px-2 py-1 rounded-md text-white font-semibold">
                <span className="loading loading-spinner text-accent"></span>
              </button>
            ) : (
              <button
                className="bg-blue-600 mt-8 w-32 h-10 px-2 py-1 rounded-md text-white font-semibold"
                onClick={editProfileHandler}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
