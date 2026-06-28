import { createSlice, current } from "@reduxjs/toolkit";


const chatSlice = createSlice({
    name : 'chats',
    initialState :{
        chat : {},
        currentChatId : null,
        loading : false,
        error : null
    },
    reducers : {
        createNewChat: (state, action)=>{
            const {chatId, title } = action.payload
            state.chat[chatId] = {
                id : chatId,
                title,
                messages : [],
                lastUpdated : new Date().toISOString()
            }
        },
        replaceTempChat:(state,action)=>{

   const {tempChatId,chatId,title}=action.payload;

   const tempChat = state.chat[tempChatId];

   delete state.chat[tempChatId];

   state.chat[chatId]={
      ...tempChat,
      id:chatId,
      title
   };

   state.currentChatId = chatId;

},
        addNewMessage : (state, action)=>{
            const {chatId, content,role } = action.payload
            state.chat[chatId].messages.push({content, role})
        },
        addMessage : (state, action)=>{
            const {chatId, messages} = action.payload
             state.chat[chatId].messages = messages;
        },
        setChat : (state, action)=>{
            state.chat = action.payload
        },
        setCurrentChatId : (state, action)=>{
            state.currentChatId = action.payload
        },
        setLoading : (state, action)=>{
            state.loading = action.payload
        },
        setError : (state, action)=>{
            state.error = action.payload
        }
    }
})

export const {setChat,setCurrentChatId, replaceTempChat, setLoading, setError, createNewChat, addNewMessage, addMessage} = chatSlice.actions
export default chatSlice.reducer