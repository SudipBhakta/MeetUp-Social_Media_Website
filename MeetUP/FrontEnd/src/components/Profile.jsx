import React from "react";
import getUserProfile from "../hooks/getUserProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Profile() {
  const params = useParams();
  const userId = params.id;
  getUserProfile(userId);
  const { userProfile , user } = useSelector((stor) => stor.auth);
  // const isLogedinUserProfile = true;
  return (
    <>
      <div className="w-full  flex mx-auto justify-center">
        <div className="grid grid-cols-2 gap-4">
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
                {user?._id ===userProfile?._id ? (
                  <button className="bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded text-white">
                    Edit Profile
                  </button>
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
                {user?._id !==userProfile?._id ? (
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Follow
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default Profile;
