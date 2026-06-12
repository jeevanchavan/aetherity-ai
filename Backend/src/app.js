import express from 'express'
import cookieParser from 'cookie-parser';
import morgan from 'morgan'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(morgan("dev"))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
app.use("/api/auth",authRouter)
app.use("/api/chats",chatRouter);

export default app;