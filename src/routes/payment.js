const express=require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter=express.Router();

paymentRouter.post("/payment/create",userAuth,async(req,res)=>{
    try{

    }catch(err){
        res.status(400).send("ERROR"+err.message)
    }
})

module.exports=paymentRouter