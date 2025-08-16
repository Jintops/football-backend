const express=require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter=express.Router();
const razorpayInstance=require('../utils/razorpay')
const Order=require('../models/order');
const Product = require('../models/product');

paymentRouter.post("/payment/create",userAuth,async(req,res)=>{
    try{
     const {firstName,lastName}=req.user


const {productId,address,paymentMethod,quantity ,totalAmount}=req.body;

     const order=await razorpayInstance.orders.create({
   "amount": totalAmount,
   "currency": "INR",
   "receipt": "receipt#1",
  "notes": {
    firstName,
    lastName
  }
})


const product=await Product.findById(productId)

if(!product){
    res.status(404).json({success:false,message:"product not found"})
}

  const cartItems=[
            {
                productId:product._id,
                title:product.title,
                price:product.price,
                imageUrl:product.image,
                quantity:quantity
            }
        ]

const payment=new Order({
    
 userId:req.user._id,
 cartItems,
 orderId:order.id,
 address,
 paymentMethod,
 totalAmount

})

const savedPayment=await payment.save();

res.json({savedPayment})
    }catch(err){
        res.status(400).send("ERROR"+err.message)
    }
})

module.exports=paymentRouter