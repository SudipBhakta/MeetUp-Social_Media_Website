import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setMessages} from "../redux/chatSlice";

const useRealTimeMessage = () => {
  const dispatch = useDispatch();
  const { messages} = useSelector((store) => store.chat);
  const {socket}= useSelector(store =>store.socket)
  
  useEffect(() => {

    socket.on("newMessage", (newMessage) => {
        console.log(newMessage)
      dispatch(setMessages([...messages, newMessage]));
    });
    return () => {
        socket?.off('newMessage');
    };
  }, [messages,setMessages]);

};

export default useRealTimeMessage;
