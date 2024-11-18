import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const getAllMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.chat);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const allMessage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/message/getMessage/${selectedUser._id}`,
          { withCredentials: true } 
        );
        
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log("Get All Message", error);
      }
    };
    
    allMessage();
  }, [selectedUser, dispatch]);

};

export default getAllMessages;
