import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPosts } from "../redux/postSlice";

const getAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const allPost = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/post/allposts",
          { withCredentioal: true }
        );
        if (res.data.success) {
          console.log(res.data);
          dispatch(setPosts(res.data.allPost));
        }
      } catch (error) {
        console.log("Get All Post", error);
      }
    };
    allPost();
  }, []);
};
export default getAllPosts;
