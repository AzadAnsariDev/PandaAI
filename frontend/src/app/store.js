import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import chatReducer from '../features/chat/chatSlice'
import compareReducer from '../features/compare/compareSlice'

export const store = configureStore({
    reducer:{
        auth : authReducer,
        chats : chatReducer,
        compare : compareReducer
    }
})