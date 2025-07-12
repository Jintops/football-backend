const express =require('express');
const User = require('../models/user');
const userRouter=express.Router();


userRouter.post('/login',async(req,res)=>{
    try{
  const {firstName,emailId,password,}=req.body;

   
  const user= new User({
    firstName,
    emailId,
    password
  })
  const data=await user.save();
   res.json({ message: "user data successfully saved", data:data })
  } catch (err) {
    res.status(400).send("ERROR :" + err.message)
  }

})

module.exports=userRouter;