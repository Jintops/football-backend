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
    
        })
     
const data=await review.save();
res.status(200).json({success:true,data:data})
     
    }catch(err){
        res.status(500).send("ERROR :"+err.message)
    }
})


reviewRouter.get("/getReviews/:productId",async(req,res)=>{
    try{
        const {productId}=req.params

        if(!productId){
            return res.status(404).json({success:false,message:"ProductId is required"}) 
        }
        const reviews=await Review.find({productId:productId}).sort({createdAt:-1})
        if(!reviews || reviews.length===0){
            return res.status(404).json({success:false,message:"No review Availabel for this Product"})
        }

        res.status(200).json({success:true,data:reviews})
    }catch(err){
        res.status(500).send("ERROR :"+err.message)
    }
})

reviewRouter.patch("/likes/:reviewId",userAuth,async(req,res)=>{
    try{
      const {reviewId}=req.params;
      const user=req.user;
      const {likes,dislikes}=req.body
     const review=await Review.findByIdAndUpdate({_id:reviewId},{likesCount:likes,dislikesCount:dislikes},
        {new:true}
     )
    
     if(!review){
        return res.status(404).json({success:false,message:"Review not found"})
     }

     res.status(200).json({success:true,message:"updated"})

    }catch(err){
        res.status(500).send("ERROR :"+err.message)
    }
})


module.exports=reviewRouter;