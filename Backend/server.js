import 'dotenv/config'
import app from "./src/app.js";
import connectToDB from './src/config/db.js';
import http from 'http'
import { initSocket } from './src/sockets/server.socket.js';

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectToDB()
    .catch((err)=>{
        console.log("error connecting mongodb",err)
        process.exit(1)
    });


httpServer.listen(PORT,()=>{
    console.log(`server is listening at port ${PORT}`)
})