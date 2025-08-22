const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema({
     
 productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true,
 },
 userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
 },
 firstName:{
    type:String,
    required:true,
 },
 reviewMessage:{
    type:String,
 },
 rating:{
    type:Number,
    required:true
 },
 likes: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "User" 
    }],   
 dislikes: [{
     type: mongoose.Schema.Types.ObjectId,
         ref: "User" 
        }],

},{timestamps:true})


module.exports=mongoose.model("Review",reviewSchema)