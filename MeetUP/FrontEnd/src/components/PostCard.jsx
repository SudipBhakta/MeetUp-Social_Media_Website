import {
  BookMarked,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setCurrentPost, setPosts } from "../redux/postSlice";
import CommentDialog from "./CommentDialog";

const Post = ({ post }) => {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(
    post.likes.includes(user._id) || false
  );
  const dispatch = useDispatch();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const likeUnlikeHandler = async () => {
    try {
      const action = isLiked ? "unlike" : "like";
      const res = await axios.post(
        `http://localhost:4000/api/v1/post/${post._id}/${action}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updateLike = isLiked ? likes - 1 : likes + 1;
        setLikes(updateLike);
        setIsLiked(!isLiked);
        const updatedPostlikes = posts.map((singlePost) =>
          singlePost._id === post._id
            ? {
                ...singlePost,
                likes: isLiked
                  ? singlePost.likes.filter((id) => id !== user._id)
                  : [...singlePost.likes, user._id],
              }
            : singlePost
        );
        dispatch(setPosts(updatedPostlikes));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/post/${post?._id}/deletepost`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPost = posts.filter(
          (postItem) => postItem._id !== post?._id
        );
        closeCommentDialog;
        dispatch(setPosts(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openCommentDialog = () => {
    dispatch(setCurrentPost(post));
    setIsCommentModalOpen(true);
  };

  const closeCommentDialog = () => {
    setIsCommentModalOpen(false);
  };

  return (
    <>
      <div className="bg-base-100 w-[78%] h-auto mr-2 mb-3 border-2 rounded-lg">
        <div className="m-3 bg-base-100">
          <div className="h-16 w-full flex relative">
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
          {post.caption && <p className="mt-3 mb-2">{post.caption}</p>}
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
          <div className="flex justify-between px-3 pt-2 border-t">
            <button
              onClick={likeUnlikeHandler}
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
              onClick={openCommentDialog} // Open the comment dialog
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

      {/* Conditional rendering of the comment dialog */}
      {isCommentModalOpen && <CommentDialog closeModal={closeCommentDialog} />}

      {/* Modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box flex flex-col z-10 items-center w-[16%] rounded-md justify-between p-0 py-2">
          <div className="p-2 cursor-pointer hover:bg-blue-600 w-full text-center">
            unfollow
          </div>
          <div className="p-2 cursor-pointer hover:bg-blue-600 w-full text-center">
            Add to Bookmark
          </div>
          {user && user?._id === post?.author._id && (
            <>
              <div className="p-2 cursor-pointer hover:bg-blue-600 w-full text-center">
                edit
              </div>
              <div
                className="p-2 cursor-pointer hover:bg-blue-600 w-full text-center"
                onClick={deletePostHandler}
              >
                delete
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>
    </>
  );
};

export default Post;
