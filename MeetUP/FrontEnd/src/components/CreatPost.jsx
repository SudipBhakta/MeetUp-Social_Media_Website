import axios from "axios";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";

const CreatePost = () => {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);

  const [post, setPost] = useState({
    caption: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleDeleteImage = () => {
    setPost((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  const handlePostChange = (e) => {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    adjustTextareaHeight();
  };
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const caption = post.caption || "";
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("caption", caption);
      if (post.image) {
        formData.append("image", post.image);
      }
      const res = await axios.post(
        "http://localhost:4000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success("Post created successfully!", {
          position: "top-center",
          style: {
            zIndex: 9999,
          },
        });
        setPost({ caption: "", image: null });
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        document.getElementById("my_modal_4").close();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.", {
        position: "top-center",
        style: {
          zIndex: 9999,
        },
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <dialog id="my_modal_4" className="modal m-0">
        <div className="modal-box w-7/12 max-w-5xl p-0 h-[80%] relative flex flex-col">
          <form method="dialog" className="flex flex-col h-full">
            <div className="flex-shrink-0">
              <div className="avatar sticky top-0 bg-white w-full p-4">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={() => document.getElementById("my_modal_4").close()}
                >
                  ✕
                </button>
                <div className="w-10 ring-2 ring-blue-800 rounded-full">
                  <img src={user?.avatar} alt="User avatar" />
                </div>
                <h1 className="card-title ml-4 text-black underline font-semibold">
                  {user?.username}
                </h1>
              </div>
            </div>
            <div className="h-full flex-grow  overflow-auto">
              <div className="min-h-80 max-h-80">
                <div className="p-1 max-h-full">
                  <textarea
                    ref={textareaRef}
                    className="w-full border-none bg-transparent p-2 max-h-full focus:outline-none block resize-none"
                    placeholder="What's on your mind?"
                    name="caption"
                    value={post.caption}
                    onChange={handlePostChange}
                    style={{ height: "auto" }}
                  />
                </div>
                {imagePreview && (
                  <div className="m">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full sticky bottom-0 z-10 bg-white">
              <div className="px-4 pt-2 ">
                <label className="cursor-pointer  text-blue-600 font-semibold">
                  {post.image ? "Change Image" : "Add Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview && (
                  <label
                    onClick={handleDeleteImage}
                    className="cursor-pointer text-blue-600 font-semibold ml-4"
                  >
                    Delete Image
                  </label>
                )}
              </div>

              <div className="px-4 py-2">
                {loading ? (
                  <button className="w-full h-10 rounded-md bg-blue-700 ">
                    <span className="loading loading-spinner text-accent"></span>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className={`w-full py-2 rounded-md font-bold transition duration-200 ${
                      !post.caption.trim() && !post.image
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={!post.caption.trim() && !post.image}
                  >
                    Submit Post
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default CreatePost;
