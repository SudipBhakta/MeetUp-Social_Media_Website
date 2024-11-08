import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {  setUserProfile } from "../redux/authSlice";

const getUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/user/profile/${userId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log("Get Suggested Users Error:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);
};

export default getUserProfile;
