const jwt=require('jsonwebtoken');
const User = require('../models/user');

const adminAuth=async(req,res,next)=>{

const {token}=req.cookies;

if(!token){
    return res.status(401).json({success:false,message:"unauthorised admin!"})
}
 try{
const decodedData=await jwt.verify(token,process.env.JWT_SECRET)
const {_id}=decodedData;
const user=await User.findById(_id);
 if (!user) {
      throw new Error("No Admin found!");
    }
    if(user.role!=="admin"){
        throw new Error("No Admin found")
    }
    req.user=user;
    next()

 }catch(err) {
    return res.status(401).json({
      success: false,
      message: "unauthorised admin!",
    });
  }
}

module.exports={adminAuth}