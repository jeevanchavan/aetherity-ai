import { configureStore } from "@reduxjs/toolkit";
import  authReducer  from "../features/auth/auth.slice";
import chatReducer from "../features/chat/chatSlice";


export const store = configureStore({
    reducer:{
        auth:authReducer,
        chat:chatReducer,
    }
})