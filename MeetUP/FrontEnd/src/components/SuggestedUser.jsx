import React from "react";
import { useSelector } from "react-redux";
import useGetSuggestedUser from "../hooks/getSuggestedUser";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
  useGetSuggestedUser();

  const { suggestedUsers } = useSelector((store) => store.auth);

  const users = Array.isArray(suggestedUsers) ? suggestedUsers : [];

  return (
    <>
      <div className="">
        <div className="flex flex-col mb-4 py-2 items-center border-b-2 mx-3">
          <h1 className="font-semibold">People you may want to follow</h1>
        </div>

        {users.length === 0 ? (
          <p>No suggested users to follow at the moment.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="flex items-center relative m-2 p-2  rounded-md border-2 ">
              <Link to={`/profile/${user?._id}`}>
                {" "}
                <div className="avatar ">
                  <div className=" w-12 h-12 ring-2 ring-blue-700 rounded-full">
                    <img
                      src={
                        user.avatar ||
                        "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
                      }
                      alt={user.username}
                    />
                  </div>
                </div>
              </Link>
              <div className="ml-3 w-full">
                <h1 className="font-semibold">{user.username}</h1>
                <p>{user.bio || ""}</p>
              </div>
              <button className="bg-blue-500 text-white px-4 py-1 hover:bg-blue-700 rounded-xl">Follow</button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SuggestedUser;
