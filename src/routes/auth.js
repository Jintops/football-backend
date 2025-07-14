const express = require("express");
const User = require("../models/user");
const userRouter = express.Router();
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt')


userRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, emailId, password,number,gender,lastName,photoUrl } = req.body;
const passwordHash=bcrypt.hash(password,10)
    const user=await User.findOne({emailId:emailId})
    
    if(user){
        return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
    }

    const newUser = new User({
      firstName,
      emailId,
      password:passwordHash,
      number,
      gender,
      lastName,
      photoUrl
    });
    const data = await newUser.save();
    res.json({ message: "user data successfully saved", data: data });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});


userRouter.post("/login",async(req,res)=>{
  try{
    const {emailId,password}=req.body

    const user=await User.findOne({emailId:emailId});
    if(!user){
   return res.json({
        success:false,
        message:"User not  found"
      })
    }
    if(user.password!==password){
      return res.json({
        success:false,
        message:"pasword is not correct"
      })
    }else{   
      res.json({message:"login success",user})
    }

  }catch(err){
    res.status(400).send("ERROR"+err.message)
  }
})

module.exports = userRouter;
