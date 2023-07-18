const express = require("express");
const {connection}=require("./config/db");
require("dotenv").config();
const {doctorRouter}=require("./Routes/doctor.routes");
const app=express();
app.use(express.json());

app.use("/doctor",doctorRouter)




app.listen(process.env.PORT,async()=>{
    try {
        connection;
        console.log("connected to DB");
        console.log("server is running"); 
    } catch (err) {
        throw new Error("failed to connect");
    }
})