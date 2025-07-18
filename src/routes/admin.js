const express=require('express');
const Product = require('../models/product');
const { validProductEdit } = require('../utils/validation');
const { adminAuth } = require('../middlewares/admin');
const User = require('../models/user');
const adminRouter=express.Router();


adminRouter.post("/addProduct",adminAuth,async(req,res)=>{
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
});

adminRouter.put("/editProduct/:id",adminAuth,async(req,res)=>{
    try{
        if(!validProductEdit(req)){
            throw new Error("not valid!")
        }
       const id=req.params.id
       
       const product=await Product.findById(id)

       if(!product){
        return res.status(404).json({success:false,message:"product not found"})
       }

       Object.keys(req.body).forEach((key)=>{
        product[key]=req.body[key]
       })

      await product.save();
       res.status(200).json({success:true,message:"product details updated"})
        
    }catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
});

adminRouter.delete("/deleteProduct/:id",adminAuth,async(req,res)=>{
    try{
    const id=req.params.id
    const deleteProduct=await Product.findByIdAndDelete(id)
    if(!deleteProduct){
        res.status(404).json({success:false,message:"product not found"})
    }
    res.status(200).json({success:true,message:"product deleted successfully"})
    }catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

adminRouter.get("/getAllUsers",adminAuth,async(req,res)=>{
    try{
        const users=await User.find({});
        res.status(200).json({success:true,data:users})
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
});

adminRouter.delete("/deleteUsers/:id",adminAuth,async(req,res)=>{
    try{
       const {id}=req.params;
       const user=await User.findByIdAndDelete(id);
       if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
       res.status(200).json({success:true,message:"user deleted successfuly"})
    }catch(err){
        res.status(400).send("ERROR :" +err.message)
    }
})

module.exports=adminRouter;