const express = require("express");
const {connection}=require("./config/db");
require("dotenv").config();

const app=express();
app.use(express.json());

// 1) userRoutes
// 2) doctor Routes



app.listen(process.env.PORT,async()=>{
    try {
        connection;
        console.log("connected to DB");
        console.log("server is running"); 
    } catch (err) {
        throw new Error("failed to connect");
    }
})