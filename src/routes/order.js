const express=require('express');
const { userAuth } = require('../middlewares/auth');
const Product = require('../models/product');
const Order = require('../models/order');
const orderRouter=express.Router();
const Address=require('../models/address')


orderRouter.post("/createOrder",userAuth,async(req,res)=>{
    try{

        const user=req.user;
        const {address,paymentMethod,productId,quantity,totalAmount}=req.body;
    
        const product=await Product.findById(productId);
        if(!product){
           return res.status(404).json({success:false,message:"NO Product found!"})
        }
      
        // const saveAddress=new Address({
        //       userId:user._id,
        //       name:address.name,
        //       phone:address.phone,
        //       pincode:address.pincode,
        //       place:address.place,
        //       fullAddress:address.fullAddress,


        // })
        // await saveAddress.save();
        
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
            totalAmount:totalAmount/100

        })

        const newOrder=await order.save();
        res.status(200).json({success:true,message:"Order success",data:newOrder})

        
    }catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
});



orderRouter.get("/orderList",userAuth,async(req,res)=>{
    try{

        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const skip=(page-1)*limit
      
    const user=req.user;

       const totalOrders = await Order.countDocuments({ userId: user._id, isDeleted: false })

     const order=await Order.find({userId:user._id,isDeleted:false}).sort({createdAt:-1}).skip(skip).limit(limit);
   
    res.status(200).json({ 
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
      totalRecords: totalOrders,
      data: order
    })
    }catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})


orderRouter.get("/order/:orderId",userAuth,async(req,res)=>{
    try{
        const user=req.user
        const {orderId}=req.params
     const order=await Order.findOne({_id:orderId,userId:user._id,isDeleted:false})
     if(!order){
        return res.status(404).json({success:false,message:"NO order found"})
     }

     res.status(200).json({success:true,data:order})
    }catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
});

orderRouter.patch("/deleteOrder/:orderId",userAuth,async(req,res)=>{
    try{
        const {orderId}=req.params;
        const user=req.user;
        const order=await Order.findOneAndUpdate({_id:orderId,userId:user._id,isDeleted:false},
            {isDeleted:true},
        {new:true})
        if(!order){
            return res.status(404).json({success:false,message:"No Order found"})
        }
        res.status(200).json({success:true,message:"Order successfully deleted",data:order})

    }catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})



module.exports=orderRouter;