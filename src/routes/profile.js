const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const User = require("../models/user");
const { validProfileEdit, validPassword } = require("../utils/validation");
const bcrypt=require('bcrypt');
const { upload, imageUploadUtil } = require("../utils/cloudinary");
const { v2: cloudinary } = require("cloudinary");
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
}

    const { password, ...safeUser } = user._doc;
    res.status(200).json({ success: true, data: safeUser });
  } catch (err) {
   res.status(400).json({ success: false, message: err.message });

  }
});

profileRouter.put("/profile/edit", userAuth, upload.single("image"), async (req, res) => {
  try {
    if (!validProfileEdit(req)) {
      throw new Error("edit failed!");
    }

    const user = req.user;

  
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

     if (req.file) {      
        if (user.photoId) {
          await cloudinary.uploader.destroy(user.photoId);
        }
        const result = await imageUploadUtil(req.file);
        user.photoUrl = result.secure_url;
        user.photoId = result.public_id;
      }

    const updateData= await user.save();
    res.status(200).json({ success: true, message: "user updated",data:updateData });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});


profileRouter.patch("/profile/editpassword", userAuth, async (req, res) => {
  try {
    
    const { oldPassword,newPassword,confirmPassword } = req.body;
    const user = req.user;
    const isPasswordCorrect=await bcrypt.compare(oldPassword,user.password);

     if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "oldpassword is not correct",
      });
    }
    validPassword(req)
    if(newPassword!==confirmPassword){
        return res.json({
            success:false,
            message:"new password is not matching"
        })
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
      
    await User.findOneAndUpdate({ _id: user._id }, { password: passwordHash });
    res.status(200).json({ success: true, message: "password successfully updated" });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});


module.exports = profileRouter;
