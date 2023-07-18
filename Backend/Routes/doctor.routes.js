
const {Router} = require("express");
const {DoctorModel}= require("../Model/doctor.model");
const doctorRouter= Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

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
                    token:token
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

doctorRouter.get("/logout",async(req,res)=>{
    try {
        const token= req.headers.split(" ")[1];
        
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



module.exports={doctorRouter}