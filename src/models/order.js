const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({

userId:String,
cartItem:{
    title:String,
    price:Number,
    imageUrl:String,
    quantity:Number,
    required:true
},
address:{
    name:String,
    address:String,
    pincode:Number,
    place:String,
    phone:String
}

},{timestamps:true});

module.exports=mongoose.model('Order',orderSchema)