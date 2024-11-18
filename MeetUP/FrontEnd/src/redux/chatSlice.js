import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  onlineUsers: [],
  selectedUser: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
   
  },
});

export const { setMessages, setSelectedUser, setOnlineUsers} = chatSlice.actions;
export default chatSlice.reducer;
