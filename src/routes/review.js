const express=require('express');
const { userAuth } = require('../middlewares/auth');
const Review = require('../models/review');
const Product = require('../models/product');

const reviewRouter=express.Router();

reviewRouter.post("/addReview",userAuth,async(req,res)=>{
    try{
        const user=req.user
        const {productId,reviewMessage,rating}=req.body
        
        const product=await Product.findById(productId);
        if(!product){
           return res.status(404).json({success:false,message:"Product Not Found"})
        }
          if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }
         
        const review=new Review({
            productId:product._id,
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