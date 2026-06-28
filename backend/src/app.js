import express from 'express';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import chatRouter from './routes/chat.route.js';


const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials : true,
    origin : "http://localhost:5173"
}))


/*
Register Route
Path: /api/auth/register
*/
app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter)

export default app;
