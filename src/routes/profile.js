const express =require('express');
const { userAuth } = require('../middlewares/auth');
const profileRouter=express.Router();
const User=require('../models/user');
const { validProfileEdit } = require('../utils/validation');

profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
       const user=req.user;
        const { password, ...safeUser } = user._doc;
    res.status(200).json({ success: true, data: safeUser });
    

    }catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
});

profileRouter.put("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validProfileEdit(req)){
            throw new Error("edit failed!")
        }
        const user=req.user;
        
 Object.keys(req.body).forEach((key)=>{
    user[key]=req.body[key]
 })
    
      const data=await user.save();
      res.status(200).json({success:true,message:"user updated",data})
    }catch(err){
        res.status(400).send("ERROR :" +err.message)
    }
})






module.exports=profileRouter;