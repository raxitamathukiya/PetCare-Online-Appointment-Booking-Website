const express = require("express");
const {connection}=require("./config/db");
const {userRoutes}=require('./Routes/user.routes')
require("dotenv").config();
const {doctorRouter}=require("./Routes/doctor.routes");
const { setupSocket } = require('./socket'); 
const cors = require('cors');
const passport = require("passport")
const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize())
const server = require('http').createServer(app);

setupSocket(server); 


  app.get('/',async(req,res)=>{
    try {
        res.send("welcome to home page")
    } catch (error) {
        console.log(error)
    }
  })
app.use("/doctor",doctorRouter)

app.use('/',userRoutes)
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
