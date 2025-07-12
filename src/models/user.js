const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
 firstName:{
    type:String,
    required:true,
 },
 lastName:{
    type:String
 },
 emailId:{
    type:String,
    required:true,
    unique:true
 },
 password:{
    type:String,
    required:true
 },
 number:{
    type:Number,
 },
 role:{
  type:String,
  default:"user"
 },
 gender:{
    type:String
 },
 photoUrl:{
    type:String
 }
},{timestamps:true})

module.exports=mongoose.model('User',userSchema)