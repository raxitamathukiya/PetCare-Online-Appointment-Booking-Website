const nodemailer=require("nodemailer");
require("dotenv").config();

let transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"sambhajisd4@gmail.com",
        pass:process.env.mailPass
    }

});

module.exports={transporter};