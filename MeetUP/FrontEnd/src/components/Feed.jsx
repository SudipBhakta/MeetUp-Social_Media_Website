import React from "react";
import Post from "./Post";

const Feed = () => {
  return (
    <>
      <div className="flex flex-col items-center mt-8">
        <div className="flex rounded-md bg-white w-[78%] mb-3 p-3 mr-2">
          <div className="avatar  ">
            <div className="w-12  rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className=" ml-3 w-full">
            <button
              className=" h-12 rounded-full  border bg-slate-200 border-blue-300 w-[90%] p-3 text-left"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              Create your Post...
            </button>
          </div>

          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">
                Press ESC key or click on ✕ button to close
              </p>
            </div>
          </dialog>
        </div>
        <Post />
        <Post />
      </div>
    </>
  );
};

export default Feed;
