const mongoose=require('mongoose')

const addressSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
    },
      pincode: {
         type: Number, 
         required: true
         },
      place: { 
        type: String,
         required: true 
        },
      fullAddress: {
         type: String,
          
         },
 
},{timestamps:true})

module.exports=mongoose.model("Address",addressSchema)
