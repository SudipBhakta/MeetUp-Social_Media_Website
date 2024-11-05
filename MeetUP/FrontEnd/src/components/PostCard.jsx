import {
  BookMarked,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes("user_id"));
  const [text, setText] = useState("");
  const { user } = useSelector((store) => store.auth);

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/post/${post._id}/likeandunlike`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setLikes(res.data.likes); // Update likes count from backend response
        setIsLiked(!isLiked); // Toggle liked state
      }
    } catch (error) {
      console.error("Error in like/unlike:", error);
    }
  };
  const commentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const postComment = () => {
    alert(text);
  };

  return (
    <>
      <div className="bg-base-100 w-[78%] h-auto mr-2 mb-3 border-2 rounded-lg">
        <div className="m-3 bg-base-100">
          <div className="h-16 w-full  flex relative">
            <div className="avatar flex items-center">
              <div className="w-10 h-10 ring-2 border-blue-700 rounded-full">
                <img
                  src={
                    post.author.avatar ||
                    "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
                  }
                  alt={post.author.username}
                />
              </div>
              <h2 className="text-2xl font-semibold underline ml-4">
                {post.author.username}
              </h2>
            </div>
            <MoreHorizontal
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            />
          </div>

          {post.caption && <p className="mt-3  mb-2">{post.caption}</p>}
          <div className="w-full h-80 flex items-center justify-center bg-transparent rounded-l-sm">
            <img
              src={post.image}
              alt="Post Image"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div>
            {likes ? (
              <div className="flex gap-2 px-3 pt-2 pb-1">
                <h3 className="font-semibold">React</h3>
                <span>{likes}</span>
              </div>
            ) : (
              <div className="flex gap-2 px-3 pt-2 pb-1"></div>
            )}
          </div>

          <div className="flex justify-between px-3  pt-2 border-t">
            <button
              onClick={handleLike}
              className={`flex h-10 items-center p-4 space-x-2 rounded-md ${
                isLiked
                  ? "text-red-500"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Heart />
              <h3 className="font-semibold">React</h3>
            </button>
            <button
              className="flex h-10 hover:bg-blue-50 hover:text-blue-600 rounded-md items-center p-4 space-x-2"
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              <MessageCircle />
              <h3 className="font-semibold">Comment</h3>
            </button>
            <button className="flex h-10 hover:bg-blue-50 hover:text-blue-600 rounded-md items-center p-4 space-x-2">
              <Share2 />
              <h3 className="font-semibold">Share</h3>
            </button>
            <button className="flex h-10 hover:bg-blue-50 hover:text-blue-600 rounded-md items-center p-4 space-x-2">
              <BookMarked />
              <h3 className="font-semibold">Bookmark</h3>
            </button>
          </div>
        </div>
      </div>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box flex flex-1 rounded-sm max-w-5xl p-0 border h-[70%]">
          <div className="w-1/2 h-full flex items-center justify-center bg-slate-900 rounded-l-sm">
            <img
              src={post.image}
              alt="Post Image"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between p-3">
            <div className="flex items-center justify-between mb-2 ">
              <div className="flex items-center">
                <Link className="avatar">
                  <div className="w-9 rounded-full ring-2 ring-blue-700 ">
                    <img
                      src={
                        post.author.avatar ||
                        "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
                      }
                      alt={post.author.username}
                    />
                  </div>
                </Link>
                <Link>
                  <h2 className="card-title ml-4 ">{post.author.username}</h2>
                </Link>
              </div>
              <MoreHorizontal
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              />
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box flex flex-col items-center w-[16%] rounded-md justify-between p-0 py-2">
                  <div className="p-2 cursor-pointer hover:bg-blue-600 w-full text-center">
                    unfollow
                  </div>
                  <div className="p-2 cursor-pointer hover:bg-blue-600 w-full text-center">
                    Add to Bookmark
                  </div>
                  {user && user?._id === post?.author._id &&
                  <div>
                    <div className="p-2 cursor-pointer hover:bg-blue-600 w-full text-center">
                    edit
                  </div>
                  <div className="p-2 cursor-pointer hover:bg-blue-600 w-full text-center">
                    delete
                  </div>
                  </div>

                  }
                  
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">comments</div>
            <div className="p-4">
              <div className="flex">
                <input
                  type="text"
                  onChange={commentHandler}
                  value={text}
                  placeholder="Add a comment..."
                  className="w-full p-2  bg-transparent border-b-2 focus:outline-none"
                />
                <button
                  className=" px-2 h-6 mt-4 w-16 ml-3 font-bold  text-sm text-white rounded-md bg-blue-500 hover:bg-blue-700"
                  onClick={postComment}
                  disabled={text.trim() === ""}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Post;
