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

addressRouter.put("/editAddress/:id",userAuth,async(req,res)=>{
    try{
        const user=req.user
        const {id}=req.params
        const {name,phone,fullAddress,pincode,place}=req.body


        const address=await Address.findById(id)
        
        if(!address){
            return res.status(404).json({success:false,message:"No Address found"})
        }

 if (address.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this address" });
    }

        if(name) address.name=name      
        if(phone) address.phone=phone
        if(fullAddress) address.fullAddress=fullAddress
        if(pincode) address.pincode=pincode
        if(place) address.place=place

       const editedAddress= await address.save()
          
        res.status(200).json({success:true,message:"Address edited successfully",data:editedAddress})

    }catch(err){
        res.status(500).send("ERROR :"+err.message)
    }
})

addressRouter.delete("/deleteAddress/:id",userAuth,async(req,res)=>{
    try{
        const user=req.user
        const {id}=req.params
        const address=await Address.findById(id)
        if(!address){
            return res.status(404).json({success:false,message:"No address found"})
        }
         if (address.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this address" });
    }
    await address.deleteOne();
    
        res.status(200).json({success:true,message:"Deleted successfully"})
    }catch(err){
        res.status(500).send("ERROR :"+err.message)
    }
})


module.exports=addressRouter;