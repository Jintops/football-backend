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
        message: "Password must be strong. Use at least 8 characters, including a number, uppercase, lowercase, and a special symbol.",
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
      isVerified: false
    });
    
    const savedUser = await newUser.save();
    
    // ✅ Fixed: Remove res parameter and handle errors properly
    const otpResult = await sendOtpVerificationEmail(savedUser);
    
    if (!otpResult.success) {
      // If OTP fails, we can still return success but mention email issue
      return res.status(201).json({ 
        success: true, 
        message: "User created but failed to send verification email. Please try resending OTP.",
        userId: savedUser._id,
        emailSent: false
      });
    }

    const token = await jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ 
      success: true, 
      message: "User registered successfully. Please check your email for verification OTP.", 
      userId: savedUser._id,
      emailSent: true
    });
    
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

    // ✅ Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in",
        needsVerification: true,
        userId: user._id
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

// ✅ Fixed: Removed res parameter and proper error handling
const sendOtpVerificationEmail = async ({_id, emailId}) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
 
    const mailOptions = {
      from:'"SoccerGear"<process.env.EMAIL>', 
      to: emailId,
      subject: "Verify your email", 
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Please enter the following OTP to verify your email:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
            ${otp}
          </div>
          <p><strong>This OTP will expire in 5 minutes.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    const hashedOtp = await bcrypt.hash(otp, 10);
    const newOtpVerify = new OtpVerification({
      userId: _id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000
    });
    
    await newOtpVerify.save();
    await transporter.sendMail(mailOptions);

    return { success: true };

  } catch (err) {
    console.error("OTP Email Error:", err);
    return { success: false, error: err.message };
  }
};

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

// ✅ Added: Resend OTP functionality
userRouter.post("/resend-otp", async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User is already verified" });
    }
    
    // Delete existing OTP
    await OtpVerification.deleteOne({ userId });
    
    // Send new OTP
    const otpResult = await sendOtpVerificationEmail(user);
    
    if (!otpResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP email" 
      });
    }
    
    res.json({ success: true, message: "OTP resent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

module.exports = userRouter;