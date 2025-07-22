const express=require('express');
const { userAuth } = require('../middlewares/auth');
const Product = require('../models/product');
const Order = require('../models/order');
const orderRouter=express.Router();


orderRouter.post("/createOrder",userAuth,async(req,res)=>{
    try{

        const user=req.user;
        const{address,paymentMethod,productId,quantity,totalAmount}=req.body;

        const product=await Product.findById(productId);
        if(!product){
           return res.status(404).json({success:false,message:"NO Product found!"})
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

        const order=new Order({
            userId:user._id,
            cartItems,
            address,
            paymentMethod,
            totalAmount

        })

        const newOrder=await order.save();
        res.status(200).json({success:true,message:"Order success",data:newOrder})

        
    }catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
});


orderRouter.get("/orderList",userAuth,async(req,res)=>{
    try{
    const user=req.user;
    const order=await Order.find({userId:user._id}).sort({createdAt:-1});
    if(order.length===0){
        return res.status(404).json({success:false,message:"No Orders found!"})
    }
    res.status(200).json({success:true,data:order})
    }catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

orderRouter.get("/order/:orderId",userAuth,async(req,res)=>{
    try{
        const {orderId}=req.params
     const order=await Order.findById(orderId)
     if(!order){
        return res.status(404).json({success:false,message:"NO order found"})
     }

     res.status(200).json({success:true,data:order})
    }catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

module.exports=orderRouter;