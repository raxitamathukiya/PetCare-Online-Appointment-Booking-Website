const mongoose=require('mongoose')
const UserSchema=mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    mobile:{type:Number,require:true},
    city:{type:String,require:true}
})  
const UserModel=mongoose.model('Users',UserSchema)
module.exports={
    UserModel
}
