import React from "react";
import { Link } from "react-router-dom"; 

const Comment = ({ comment }) => {
  return (
    <div className="my-3 p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100">
      <div className="flex items-start space-x-4">
        <Link  className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full ring-2 ring-blue-700 overflow-hidden">
            <img
              src={comment?.author?.avatar || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"}
              className="object-cover w-full h-full"
            />
          </div>
        </Link>
        {/* Comment Content Section */}
        <div className="ml-4 flex flex-col">
          <div className="flex items-center justify-between">
            <Link >
              <h1 className="text-md font-semibold text-black">{comment?.author?.username}</h1>
            </Link>
            <span className="text-xs ml-2 text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()} {/* Display comment timestamp */}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
