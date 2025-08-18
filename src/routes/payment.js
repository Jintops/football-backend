const express=require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter=express.Router();
const razorpayInstance=require('../utils/razorpay')
const Order=require('../models/order');
const Product = require('../models/product');
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");


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
 paymentStatus:order.status,
 address,
 paymentMethod,
 totalAmount:totalAmount/100

})

const savedPayment=await payment.save();

res.json({savedPayment, keyId:process.env.RAZORPAY_KEY_ID})
    }catch(err){
        res.status(400).send("ERROR"+err.message)
    }
})

paymentRouter.post("/razorpay/webhook",async(req,res)=>{
    try{
      
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      console.log("INvalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");

    
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Order.findOne({ orderId: paymentDetails.order_id });
    payment.paymentStatus = paymentDetails.status;
    await payment.save();

    return res.status(200).json({message:"webhook recieved successfully"})
    }catch(err){
        res.status(500).send("ERROR"+err.message)
    }
})

module.exports=paymentRouter