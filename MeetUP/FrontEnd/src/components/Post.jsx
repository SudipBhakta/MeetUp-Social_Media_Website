import React from "react";

const Post = () => {
  return (
    <>
      <div className=" bg-base-100 w-[78%] h-[70%] mr-2 mb-3 rounded-lg">
        <div className="m-3  bg-base-100  ">
          <div className="avatar ">
            <div className="w-12  rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
            <h2 className="card-title ml-4 ">User Name</h2>
          </div>

          <p className="mt-3 mb-2">
            If a dog chews shoes whose shoes does he choose?
          </p>

          <div className="  ">
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
              className=""
            />
          </div>
        </div>
      </div>
    </>
  );
};  

export default Post;
