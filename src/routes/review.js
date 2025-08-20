const express=require('express');
const { userAuth } = require('../middlewares/auth');
const Review = require('../models/review');

const reviewRouter=express.Router();

reviewRouter.post("/addReview",userAuth,async(req,res)=>{
    try{
        const user=req.user
        const {productId,reviewMessage,rating,likesCount}=req.body
        
        
         
        const review=new Review({
            productId,
            userId:user._id,
            firstName:user.firstName,
            reviewMessage,
            rating,
            likesCount
        })
        
const data=await review.save();
res.status(200).json({success:true,data:data})
     

    }catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})


module.exports=reviewRouter;