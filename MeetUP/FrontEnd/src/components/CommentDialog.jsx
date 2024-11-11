import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MoreHorizontal } from "lucide-react";
import Comment from "./Comment";
import { setPosts } from "../redux/postSlice";

const CommentDialog = ({ closeModal }) => {
  const { currentPost, posts } = useSelector((store) => store.posts);
  const [text, setText] = useState("");
  const [comment, setComment] = useState(currentPost?.comments || []);
  const dispatch = useDispatch()

  const commentHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const postComment = async () => {
    if (!currentPost || !text.trim()) {
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/post/${currentPost?._id}/addcomment`,
        { content: text },
        { withCredentials: true }
      );
      if (res.data.success) {
        setText("");
        const updatedComment = [ res.data.comment, ...comment];
        setComment(updatedComment);

      const updatedPostComment = posts?.map((singlePost)=>
      singlePost?._id === currentPost?._id? {...singlePost, comments:updatedComment }:singlePost )
      dispatch(setPosts(updatedPostComment))
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  if (!currentPost) {
    return <div>Loading...</div>;
  }

  return (
    <dialog id="my_modal_2" className="modal" open>
      <div className="modal-box flex flex-1 rounded-sm max-w-5xl p-0 border h-[70%]">
        <div className="w-1/2 h-full flex items-center justify-center bg-slate-900 rounded-l-sm">
          <img
            src={currentPost?.image}
            alt="Post Image"
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="w-1/2 flex flex-col justify-between p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Link className="avatar">
                <div className="w-9 rounded-full ring-2 ring-blue-700">
                  <img
                    src={
                      currentPost?.author?.avatar ||
                      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
                    }
                  />
                </div>
              </Link>
              <Link>
                <h2 className="card-title ml-4">{currentPost?.author?.username}</h2>
              </Link>
            </div>
            <MoreHorizontal onClick={() => document.getElementById("my_modal_1").showModal()} />
          </div>
          <hr />
          <div className="flex-1 overflow-y-auto max-h-96 ">
            {comment?.map((comment) => (
              <Comment key={comment?._id} comment={comment} />
            ))}
          </div>
          <div className="p-2">
            <div className="flex">
              <input
                type="text"
                onChange={commentHandler}
                value={text}
                placeholder="Add a comment..."
                className="w-full text-sm  bg-transparent border-b-2 focus:outline-none"
              />
              <button
                className="px-2 h-6 mt-4 w-16 ml-3 font-bold text-sm text-white rounded-md bg-blue-500 hover:bg-blue-700"
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
        <button onClick={closeModal}></button>
      </form>
    </dialog>
  );
};

export default CommentDialog;
