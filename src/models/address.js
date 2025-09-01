const mongoose=require('mongoose')

const addressSchema=new mongoose({
    name:{
        type:String,
        required:true
    },
    number:{
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
          required: true
         },
 
},{timestamps:true})

module.exports=mongoose.model("Address",addressSchema)
