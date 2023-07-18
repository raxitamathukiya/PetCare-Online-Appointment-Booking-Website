const mongoose=require('mongoose')
const UserSchema=mongoose.Schema({

    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    mobile:{type:Number,require:true},
    city:{type:String,require:true}
})
// UserSchema.pre('save', async function (next) {
//     try {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = bcrypt.hash(this.password, salt);
//       this.password = hashedPassword;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   });
  
const UserModel=mongoose.model('Users',UserSchema)
module.exports={
    UserModel
}
