const express =require('express');
const { userAuth } = require('../middlewares/auth');
const profileRouter=express.Router();

profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
       const user=req.user;
        res.status(200).json({success:true,data:user})

    }catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
});





module.exports=profileRouter;