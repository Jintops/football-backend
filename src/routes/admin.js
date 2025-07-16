const express=require('express');
const Product = require('../models/product');
const { userAuth } = require('../middlewares/auth');
const adminRouter=express.Router();


adminRouter.post("/addProduct",userAuth,async(req,res)=>{
    try{
     const {title,image,price,category,description,salePrice,brand,totalStock}=req.body;

     const product=new Product({
        title,
        image,
        price,
        category,
        description,
        salePrice,
        brand,
        totalStock
     });

     const data=await product.save();
     res.status(200).json({success:true,data:data})
    }catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})

module.exports=adminRouter;