const mongoose=require("mongoose");
// name
// email
// password
// mobile
// city
// address
// clinic_name
// services
const doctorSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    img:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    clinic_name:{
        type:String,
        require:true
    },
    services: [{
        type: String,
        require:true
    }],
});

const DoctorModel= mongoose.model("doctors",doctorSchema);

module.exports={DoctorModel};