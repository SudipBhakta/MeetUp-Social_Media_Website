import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/authSlice";

const useGetSuggestedUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/user/suggestedusers",
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log("Get Suggested Users Error:", error);
      }
    };

    fetchSuggestedUsers();
  }, [dispatch]);
};

export default useGetSuggestedUser;
