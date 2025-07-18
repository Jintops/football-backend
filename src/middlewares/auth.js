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
    const decodedData = await jwt.verify(token,process.env.JWT_SECRET );
    const { _id } = decodedData;
    const user = await User.findById( _id );
    if (!user || user.role!=="user") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not a valid user",
      });
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
