const mongoose=require('mongoose')
const User_appointmentSchema=mongoose.Schema({

    username:{type:String,require:true},
    email:{type:String,require:true},
    mobile:{type:Number,require:true},
    city:{type:String,require:true},
    petname:{type:String,require:true},
    species:{type:String,require:true},
    breed:{type:String,require:true},
    age:{type:Number,require:true},
    gender:{type:String,require:true},
    weight:{type:Number,require:true},
    resaon:{type:String,require:true},
    date:{type:Date,require:true},
    time:{type:Number,require:true},
    urgency_level:{type:String,require:true},
    note:{type:String,require:true},
    doctor_id:{type:String,require:true}
})  
const User_appointmentModel=mongoose.model('Users_appointment',User_appointmentSchema)
module.exports={
    User_appointmentModel
}
