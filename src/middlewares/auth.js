const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "unauthorised user!",
    });
  }
  try {
    const decodedData = await jwt.verify(token, "JINTO@123");
    const { _id } = decodedData._id;
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("No User found!");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "unauthorised user!",
    });
  }
};

module.exports = { userAuth };
