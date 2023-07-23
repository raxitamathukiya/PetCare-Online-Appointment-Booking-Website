
const {Router} = require("express");
const {DoctorModel}= require("../Model/doctor.model");
const {User_appointmentModel}=require("../Model/User_Appointment.model");
const doctorRouter= Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {BlacklistModel}=require("../Model/Blacklist.model");
const {auth}=require("../Middleware/auth.doctors.middleware");
const {transporter}=require("../Middleware/nodemailer");


doctorRouter.post("/register", async (req,res)=>{
    const {email,password}=req.body;
    try {

        const ispresent= await DoctorModel.findOne({email});
    
        if(ispresent){
            return res.status(200).json({
                isError:true,
                msg:"User Exist Please Login"
            })
        }

        bcrypt.hash(password,5,async(err,hash)=>{
            const newuser=DoctorModel({...req.body,password:hash});
            await newuser.save()
            res.status(200).json({
                isError:false,
                msg:"User Registration Successful"
            })
        })
        
    } catch (error) {
        res.status(400).json({
            isError:true,
            msg:"something went wrong",
            error:error
        });
        
    }
});

doctorRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {

        const user= await DoctorModel.findOne({email});

        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                const token=jwt.sign({name:user.name,UserID:user._id},process.env.SecretKey,{expiresIn:"7d"});
                res.status(200).json({
                    isError:false,
                    msg:"Login Successful",
                    name:user.name,
                    token:token,
                    dr_id:user._id
                })
            }else{
                res.status(400).json({
                    isError:true,
                    msg:"Wrong Password"
                    
                })
            }
        })
        
    } catch (error) {
        res.status(400).json({
            isError:true,
            msg:"Wrong E-mail",
            error:error
        });
    }
});

doctorRouter.get("/",async(req,res)=>{
    try {
        const data= await DoctorModel.find();
        res.status(200).json({
            isError:false,
            data:data,
            
        })
        
    } catch (error) {
        res.status(404).json({
            isError:true,
            msg:"internal server error",
            error:error
        });
    }
});

doctorRouter.post("/logout",async(req,res)=>{
    try {
        const token= req.headers.authorization.split(" ")[1];

        const blacklistedToken = new BlacklistModel({ token });
        await blacklistedToken.save();

        res.status(200).json({
            isError:false,
            msg:"User Logged Out Successfully"
            
        })
        
    } catch (error) {
        res.status(404).json({
            isError:true,
            msg:"internal server error",
            error:error
        });
    }
});

// searching functionality route 
doctorRouter.get("/search",async(req,res)=>{
    const text=req.query.s;
    try {
        
        const data= await DoctorModel.find({name:{$regex:`${text}`,$options: 'mi'}});
        if(data.length==0){
            return res.status(200).json({
                isError:false,
                msg:"No Search Found",
                data:data
            });
        }
        res.status(200).json({
            isError:false,
            data:data
            
        });
        
    } catch (error) {
        res.status(404).json({
            isError:true,
            msg:"internal server error",
            error:error
        });
    }
});

//find perticular doctor by params


doctorRouter.get("/:id",async(req,res)=>{
    const {id}=req.params;
    try {
        
        const data= await DoctorModel.find({_id:id});
        
        res.status(200).json({
            isError:false,
            data:data
            
        });
        
    } catch (error) {
        res.status(404).json({
            isError:true,
            msg:"Did not get Data",
            error:error
        });
    }
});
doctorRouter.get("/appointment/:id",async(req,res)=>{
    const {id}=req.params;
    try {
        
        const data= await User_appointmentModel.find({doctor_id:id,is_conform:"Pendding"});
        console.log(data)
        res.status(200).json({
            isError:false,
            data:data
            
        });
        
    } catch (error) {
        res.status(404).json({
            isError:true,
            msg:"Did not get Data",
            error:error
        });
    }
});

// send mail  

doctorRouter.post("/sendmail",async(req,res)=>{
    // const id=req.params.id;
    const {status}=req.query;
    const {email,date,time,name,doctor_id,is_conform,_id}=req.body;
    
    try{
        const data= await DoctorModel.findOne({_id:doctor_id});
        
        const Appoint_ID=Math.floor((Math.random()*100000000)+1);
        let mailOptions;
        if(status=="true"){
            const changedata= await User_appointmentModel.findByIdAndUpdate(_id,{is_conform:"confirm"});

             mailOptions = {
                from: 'sambhajisd4@gmail.com',
                to: email,
                subject: 'Appointment CONFIRMED',
                text: `
                Hello ${name},
                YOUR Appointment is confirmed by ${data.name}
                APPOINTMENT DETAILS :-
    
                Appointment ID  :-  ${Appoint_ID}
                Date :- ${date}
                Time :- ${time}
    
                    thank you
                     PetCare
                `
            };
    
        }else{
           
            const changedata= await User_appointmentModel.findByIdAndUpdate(_id,{is_conform:"cancled"});

             mailOptions = {
                from: 'sambhajisd4@gmail.com',
                to: email,
                subject: 'Appointment CANCLED',
                text: `
                Hello ${name},
                YOUR Appointment is cancled by ${data.name}
                
                please book appoint for other date.
    
                    thank you
                     PetCare
                `
            };
        }
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.send('Error sending email');
            } else {
                res.send('Email sent successfully');
            }
        });
        

    }catch(err){
        res.status(401).send(err);
    }
})

// find total booking of perticular doctor




doctorRouter.get("/totalbbokings",auth,async(req,res)=>{
    // check once UserID  ===>
     const {UserID}=req.body;
    try {
        
        const data= await User_appointmentModel.find({doctor_id:UserID});
        
        res.status(200).json({
            isError:false,
            data:data
            
        });
        
    } catch (error) {
        res.status(404).json({
            isError:true,
            msg:"Did not get Data",
            error:error
        });
    }
});

// find all confirm appointment

doctorRouter.get("/totalbbokings/:id",async(req,res)=>{
    const {id}=req.params;
    try {
        
        const data= await User_appointmentModel.find({is_conform:"confirm",doctor_id:id});
        
        res.status(200).json({
            isError:false,
            data:data
            
        });
        
    } catch (error) {
        res.status(404).json({
            isError:true,
            msg:"Did not get Data",
            error:error
        });
    }
});

// find all pending appointment

doctorRouter.get("/totalbbokings/new",async(req,res)=>{
    const {id}=req.params;
    try {
        
        const data= await User_appointmentModel.find({is_conform:"pending",
        doctor_id
        :id});
        
        res.status(200).json({
            isError:false,
            data:data
            
        });
        
    } catch (error) {
        res.status(404).json({
            isError:true,
            msg:"Did not get Data",
            error:error
        });
    }
});





module.exports={doctorRouter}