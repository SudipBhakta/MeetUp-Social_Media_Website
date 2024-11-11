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
import PostMoreDialog from "./PostMoreDialog";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);
  const [likes, setLikes] = useState(post.likes.length);
  const comments = post.comments.length;
  const [isLiked, setIsLiked] = useState(
    post.likes.includes(user._id) || false
  );
  const dispatch = useDispatch();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const likeUnlikeHandler = async () => {
    try {
      const action = isLiked ? "unlike" : "like";
      const res = await axios.post(
        `http://localhost:4000/api/v1/post/${post?._id}/${action}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updateLike = isLiked ? likes - 1 : likes + 1;
        setLikes(updateLike);
        setIsLiked(!isLiked);
        const updatedPostlikes = posts?.map((singlePost) =>
          singlePost?._id === post?._id
            ? {
                ...singlePost,
                likes: isLiked
                  ? singlePost?.likes?.filter((id) => id !== user?._id)
                  : [...singlePost.likes, user?._id],
              }
            : singlePost
        );
        dispatch(setPosts(updatedPostlikes));
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
      <div className="bg-base-100 w-[95%] h-auto mr-2 mb-3 border-2 rounded-lg">
        <div className="mx-3 my-1 bg-base-100">
          <div className="h-16 w-full items-center flex relative">
            <Link to={`/profile/${post?.author?._id}`}>
              <div className="avatar flex ">
                <div className="w-8 h-8 ring-2 ring-blue-700 rounded-full">
                  <img
                    src={
                      post?.author?.avatar ||
                      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?uid=R112247829&ga=GA1.1.1463034516.1727452914&semt=ais_siglip"
                    }
                  />
                </div>
              </div>
            </Link>
            <Link to={`/profile/${post?.author?._id}`}>
              <h2 className="text-xl font-semibold  ml-4">
                {post?.author?.username}
              </h2>
            </Link>

            {user?._id === post?.author?._id && (
              <div className="badge bg-blue-500  text-white text-xs ml-2 ">
                Author
              </div>
            )}
            <MoreHorizontal
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => {
                dispatch(setCurrentPost(post));
                document.getElementById("my_modal_1").showModal();
              }}
            />
          </div>
          {post?.caption && <p className="my-1">{post?.caption}</p>}
          <div className="w-full h-80 flex items-center justify-center bg-transparent rounded-l-sm">
            <img
              src={post?.image}
              alt="Post Image"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex justify-between">
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
            <div>
              {comments ? (
                <div className="flex gap-2 px-3 pt-2 pb-1">
                  <h3 className="font-semibold">Comments</h3>
                  <span>{comments}</span>
                </div>
              ) : (
                <div className="flex gap-2 px-3 pt-2 pb-1"></div>
              )}
            </div>
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
              onClick={openCommentDialog}
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
      {isCommentModalOpen && <CommentDialog closeModal={closeCommentDialog} />}
      <PostMoreDialog
        id="my_modal_1"
        className="modal"
        isOpen={true}
        onRequestClose={() =>
          document.getElementById("my_modal_1").closeModal()
        }
      />
    </>
  );
};

export default Post;
