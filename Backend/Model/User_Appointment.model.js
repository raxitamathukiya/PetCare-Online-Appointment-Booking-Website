const mongoose=require('mongoose')
const User_appointmentSchema=mongoose.Schema({

    name:{type:String,require:true},
    email:{type:String,require:true},
    mobile:{type:Number,require:true},
    city:{type:String,require:true},
    petname:{type:String,require:true},
    date:{type:Date,require:true},
    time:{type:String,require:true},
    urgency_level:{type:String,require:true},
    note:{type:String},
    doctor_id:{type:String,require:true},
    user_id:{type:String,require:true},
    is_conform:{type:String,require:true,default:"Pendding"}
})  
const User_appointmentModel=mongoose.model('Users_appointment',User_appointmentSchema)
module.exports={
    User_appointmentModel
}
