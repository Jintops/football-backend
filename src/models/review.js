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
 likesCount:{
    type:Number
 }

},{timestamps:true})


module.exports=mongoose.model("Review",reviewSchema)