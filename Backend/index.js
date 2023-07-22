const express = require("express");
const {connection}=require("./config/db");
const {userRoutes}=require('./Routes/user.routes')
require("dotenv").config();
const {doctorRouter}=require("./Routes/doctor.routes");
const { setupSocket } = require('./socket'); 
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const server = require('http').createServer(app);

setupSocket(server); 


  
app.use("/doctor",doctorRouter)

app.use('/user',userRoutes)
// 1) userRoutes
// 2) doctor Routes



server.listen(process.env.PORT,async()=>{
    try {
        connection;
        console.log("connected to DB");
        console.log("server is running"); 
    } catch (err) {
        throw new Error("failed to connect");
    }
})
