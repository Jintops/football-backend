const express = require("express");
const User = require("../models/user");
const userRouter = express.Router();
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt')


userRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, emailId, password,number,gender,lastName,photoUrl } = req.body;
    const passwordHash=await bcrypt.hash(password,10)
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

    const token=await jwt.sign({_id:data._id},"JINTO@123",{expiresIn:'1h'})
    res.cookie("token",token,{ expires: new Date(Date.now() + 900000) })

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

  const isValidPassword=await bcrypt.compare(password,user.password)

    if(!isValidPassword){
      return res.json({
        success:false,
        message:"pasword is not correct"
      })
    }else{
      const token=await jwt.sign({_id:user._id},"JINTO@123",{expiresIn:'1h'})
      res.cookie("token",token,{ expires: new Date(Date.now() + 900000) })   
      res.json({message:"login success",user})
    }

  }catch(err){
    res.status(400).send("ERROR"+err.message)
  }
})


userRouter.post("/logout",async(req,res)=>{
  res.cookie("token",null,{expires: new Date(Date.now())})
  res.send("logout success")
})

module.exports = userRouter;
