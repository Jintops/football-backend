const express=require('express');
const { userAuth } = require('../middlewares/auth');
const Address = require('../models/address');

const addressRouter=express.Router();

addressRouter.post("/address",userAuth,async(req,res)=>{
    try{     
     const user=req.user;
   
     const {name,phone,fullAddress,pincode,place}=req.body

     const newAddress=new Address({
        userId:user._id,
        name,
        phone,
        pincode,
        place,
        fullAddress
     })
    const saveAddress= await newAddress.save();

    res.status(200).json({success:true,message:"New Address Saved Successfully" ,data:saveAddress})
    }catch(err){
        res.status(500).send("ERROR :"+err.message)
    }
})


addressRouter.get("/allAddress",userAuth,async(req,res)=>{
    try{  
    const user=req.user
    const addresses=await Address.find({userId:user._id}).sort({ createdAt: -1 });

    if(addresses.length===0){
        return res.status(404).json({success:false,message:"NO Address Found"})
    }
    res.status(200).json({success:true,message:"Saved Addresses",data:addresses})

    }catch(err){
         res.status(500).send("ERROR :"+err.message)
    }
})




module.exports=addressRouter;