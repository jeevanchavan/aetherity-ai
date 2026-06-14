import express from 'express'
import cookieParser from 'cookie-parser';
import morgan from 'morgan'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

// It creates __dirname manually in ES modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(express.static("./public"));
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

// wildcard api
app.use("*name",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","/public/index.html"));
})

export default app;