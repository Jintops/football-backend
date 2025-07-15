const express=require('express');
const Product = require('../models/product');
const productRouter=express.Router();


productRouter.get("/getAllProducts",async(req,res)=>{
    try{
       const productList=await Product.find()
       if(!productList){
        return res.status(404).json({success:false,message:"No Products Available"})
       }
       res.status(200).json({success:true,products:productList})
    }catch(err){
       res.status(400).send("ERROR :" + err.message)
    }
})

module.exports=productRouter