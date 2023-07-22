const express=require('express')
const {UserModel}=require('../Model/User.model')
const {connection} =require('../config/db')
const userRoutes=express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {BlacklistModel}=require('../Model/Blacklist.model');
const {authMiddleware}=require('../Middleware/Auth.middleware')
const {User_appointmentModel}=require('../Model/User_Appointment.model')
const { getIO } = require('../socket'); 

userRoutes.post('/register',async(req,res)=>{
    try {
    const { name, email, password,mobile,city } = req.body;
    const userExists = await UserModel.findOne({ $or: [{ name }, { email }] });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    bcrypt.hash(password, 10, async(err, hash)=> {
        const adddata=new UserModel({name,email,password:hash,mobile,city })
        await adddata.save()
        res.status(200).json({ msg: 'User created successfully' });
    }); 
    } catch (error) {
        res.status(400).json({
            isError:true,
            msg:"Something went wrong !!!!",
            error:error
        });
    }
})

userRoutes.post('/login',async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }); 
        if (!user) {
          return res.status(401).json({ msg: 'Invalid username or password' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return res.status(401).json({ msg: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id}, process.env.SecretKey, {
          expiresIn: '7d'
        });
        res.status(200).json({ msg: 'Login Successfully' ,Token:token,name:user.name});
      } catch (error) {
        res.status(400).json({
            isError:true,
            msg:"Something went wrong !!!!",
            error:error
        });
      }

})
userRoutes.post('/logout' ,async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const blacklistedToken = new BlacklistModel({ token });
      await blacklistedToken.save();
      res.status(200).json({msg:'Logged out successfully'});
    } catch (error) {
        res.status(400).json({
            isError:true,
            msg:"Something went wrong !!!!",
            error:error
        });
    
    }
  });
userRoutes.post('/appointment',authMiddleware,async(req,res)=>{
  try {
    
    const {name,email,mobile,city,_id}=req.body.user
    const {petname,date,time,urgency_level,note,doctor_id} =req.body;
   
    const adddata=new User_appointmentModel({name,email,mobile,city,petname,date,time,urgency_level,note,doctor_id,user_id:_id})
    await adddata.save()
    const notificationData = {
      type: 'appointment',
      message: 'New appointment confirmed!',
      appointmentDetails: adddata,
      DoctorID:doctor_id
    };
    const io = getIO();
    console.log(notificationData)
    io.emit('notification', notificationData);
     res.status(200).json({ msg: 'Appointment booking successfully' });

  } catch (error) {
    res.status(400).json({
      isError:true,
      msg:"Something went wrong !!!!",
      error:error
  });
  }
})
userRoutes.get("/getapp/:id",authMiddleware,async(req,res)=>{

  try {
    const data=await User_appointmentModel.find({user_id:req.params.id})
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({
      isError:true,
      msg:"Something went wrong !!!!",
      error:error
  });
  }
})
userRoutes.get("/get",async(req,res)=>{

  try {
    const data=await User_appointmentModel.find()
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({
      isError:true,
      msg:"Something went wrong !!!!",
      error:error
  });
  }
})

userRoutes.delete("/delete/:id",authMiddleware,async(req,res)=>{
try {
  const { id } = req.params;
  const deletedData = await User_appointmentModel.findByIdAndDelete(id);
  if (!deletedData) {
    return res.status(404).json({ msg: 'Appointment not found' });
  }
  res.status(200).json({ msg: 'Appointment deleted successfully' });
} catch (error) {
  res.status(400).json({
    isError:true,
    msg:"Something went wrong !!!!",
    error:error
});
}

})

userRoutes.put("/update/:id",authMiddleware,async(req,res)=>{
  try {
    const {id}=req.params 
        const updata=req.body
        const data= await User_appointmentModel.findByIdAndUpdate({_id:id},updata)
        res.status(200).json({ msg: 'Appointment updated successfully'});
  } catch (error) {
    res.status(400).json({
      isError:true,
      msg:"Something went wrong !!!!",
      error:error
  });
  }
  
  })

module.exports={
    userRoutes
}
