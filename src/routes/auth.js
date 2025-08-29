const express = require("express");
const User = require("../models/user");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { upload, imageUploadUtil } = require("../utils/cloudinary");
const { PROFILE_URL } = require("../utils/constants");
const validator=require('validator');
const OtpVerification = require("../models/otpVerification");
const nodemailer = require("nodemailer");

userRouter.post("/signup", upload.single("image"), async (req, res) => {

  try {
    const { firstName, emailId, password, phone, gender, lastName } = req.body;

       if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be strong. Use at least 8 characters, including a number, uppercase, lowercase, and a special symbol.",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findOne({ emailId: emailId });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "User Already exists with the same email ",
      });
    }

    let imageUrl = PROFILE_URL;
    if (req.file) {
      const result = await imageUploadUtil(req.file);
      imageUrl = result.secure_url;
    }

    const newUser = new User({
      firstName,
      emailId,
      password: passwordHash,
      phone,
      gender,
      lastName,
      photoUrl: imageUrl,
      isVerified:false
    });
       const savedUser = await newUser.save();
    await sendOtpVerificationEmail(savedUser, res);
    

    const token = await jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
       maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "user data successfully saved", userId: savedUser._id, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is wrong",
      });
    } else {
      const { password, ...safeUser } = user._doc;
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res.json({ success: true, message: "login success", user: safeUser });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const sendOtpVerificationEmail=async({_id,email},res)=>{
  try{
   
    const otp=`${Math.floor(1000+Math.random()*9000)}`;
 
    const mailOptions={
      from: process.env.EMAIL, 
      to: email, // list of receivers
      subject: "Verify your email", // Subject line
      html: `<b>Enter  ${otp} to verify</b>`,
    }


    const hashedOtp = await bcrypt.hash(otp, 10);
    const newOtpVerify=await new OtpVerification({
       userId:_id,
       otp:hashedOtp,
       createdAt:Date.now(),
       expiresAt:Date.now()+ 5 * 60 * 1000
    })
    await newOtpVerify.save();
    await transporter.sendMail(mailOptions)

    return { success: true };

  }catch(err){
    res.status(500).send("ERROR :"+err.message)
  }
}


userRouter.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: "OTP and userId are required" });
    }

    const otpRecord = await OtpVerification.findOne({ userId });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "No OTP record found" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      await OtpVerification.deleteOne({ userId });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP is valid
    await User.updateOne({ _id: userId }, { isVerified: true });
    await OtpVerification.deleteOne({ userId });

    // Issue token after verification
    const token = await jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Email verified successfully", token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


userRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

module.exports = userRouter;
