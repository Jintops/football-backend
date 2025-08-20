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
 reviewMessage:{
    type:String,
 },
 reviewValue:{
    type:Number
 }

},{timestamps:true})


module.exports=mongoose.model("Review",reviewSchema)