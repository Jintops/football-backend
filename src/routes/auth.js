const express = require("express");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, emailId, password,number,gender,lastName,photoUrl } = req.body;

    const user = new User({
      firstName,
      emailId,
      password,
      number,
      gender,
      lastName,
      photoUrl
    });
    const data = await user.save();
    res.json({ message: "user data successfully saved", data: data });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});


module.exports = userRouter;
