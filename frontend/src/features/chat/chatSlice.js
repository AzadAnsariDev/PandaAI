import { createSlice, current } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chat: {},
    currentChatId: null,
    loading: false,
    error: null,
    draftMessages: [],
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      state.chat[chatId] = {
        id: chatId,
        title,
        messages: state.draftMessages, // carry over what was already typed/streamed
        lastUpdated: new Date().toISOString(),
      };
      state.draftMessages = []; // clear, now that it lives in the real chat
    },
    replaceTempChat: (state, action) => {
      const { tempChatId, chatId, title } = action.payload;

      const tempChat = state.chat[tempChatId];

      delete state.chat[tempChatId];

      state.chat[chatId] = {
        ...tempChat,
        id: chatId,
        title,
      };

      state.currentChatId = chatId;
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role, model, image} = action.payload;
      const msg = { content, role, model, image}
      if (!chatId) {
        state.draftMessages.push(msg);
      } else {
        state.chat[chatId].messages.push(msg);
      }
    },
    addMessage: (state, action) => {
      const { chatId, messages } = action.payload;
      state.chat[chatId].messages = messages;
    },
    // chatSlice.js
    appendToLastMessage: (state, action) => {
      const { chatId, content } = action.payload;
      const list = chatId ? state.chat[chatId].messages : state.draftMessages;
      list[list.length - 1].content += content;
    },
    setChat: (state, action) => {
      state.chat = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearDraft: (state) => {
  state.draftMessages = []; // call this from handleNewChat, in case a draft was abandoned
},
  },
});

export const {
  setChat,
  setCurrentChatId,
  replaceTempChat,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessage,
  appendToLastMessage,
  clearDraft
} = chatSlice.actions;
export default chatSlice.reducer;
