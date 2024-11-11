import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";

const PostMoreDialog = () => {
  const { user} = useSelector((store) => store.auth);
  const { currentPost } = useSelector((store) => store.posts);
  const dispatch = useDispatch()

  const deletePostHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/post/${currentPost?._id}/deletepost`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPost = posts.filter(
          (postItem) => postItem?._id !== currentPost?._id
        );
        dispatch(setPosts(updatedPost));
        closeCommentDialog;

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <div>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box flex flex-col z-10 items-center w-[16%] rounded-md justify-between p-0 py-2">
            <div className="p-2 cursor-pointer hover:bg-blue-600 w-full text-center">
              unfollow
            </div>
            <div className="p-2 cursor-pointer hover:bg-blue-600 w-full text-center">
              Add to Bookmark
            </div>
            {user && currentPost && user?._id === currentPost?.author?._id && (
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
      </div>
    </>
  );
};

export default PostMoreDialog;
