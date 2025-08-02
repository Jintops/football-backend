const express = require("express");
const Product = require("../models/product");
const { validProductEdit } = require("../utils/validation");
const { adminAuth } = require("../middlewares/admin");
const User = require("../models/user");
const Order = require("../models/order");
const adminRouter = express.Router();
const { upload, imageUploadUtil } = require("../utils/cloudinary");

adminRouter.post(
  "/addProduct",
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        price,
        category,
        description,
        salePrice,
        brand,
        totalStock,
      } = req.body;

     let imageUrl = null;

      // Only upload to Cloudinary if an image file is provided
      if (req.file) {
        const result = await imageUploadUtil(req.file);
        imageUrl = result.secure_url;
      }

      const product = new Product({
        title,
        image: imageUrl, // Save Cloudinary image URL
        price,
        category,
        description,
        salePrice,
        brand,
        totalStock,
      });

      const data = await product.save();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

adminRouter.put(
  "/editProduct/:id",
  adminAuth,
  upload.single("image"), // 🟢 This enables image processing
  async (req, res) => {
    try {
      if (!validProductEdit(req)) {
        throw new Error("not valid!");
      }

      const id = req.params.id;
      const product = await Product.findById(id);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      }

      const { title, price, category, description, salePrice, brand, totalStock } = req.body;

      // Update text fields
      if (title) product.title = title;
      if (price) product.price = price;
      if (category) product.category = category;
      if (description) product.description = description;
      if (salePrice) product.salePrice = salePrice;
      if (brand) product.brand = brand;
      if (totalStock) product.totalStock = totalStock;

      // 🖼️ Handle image upload if a new file is sent
      if (req.file) {
        const result = await imageUploadUtil(req.file);
        product.image = result.secure_url;
      }

      await product.save();

      res.status(200).json({
        success: true,
        message: "product details updated",
        data: product, // send back updated data if needed
      });
    } catch (err) {
      res.status(400).send("ERROR :" + err.message);
    }
  }
);


adminRouter.delete("/deleteProduct/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      res.status(404).json({ success: false, message: "product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "product deleted successfully" });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

adminRouter.get("/getAllUsers", adminAuth, async (req, res) => {
  try {
    const users = await User.find({role:"user"});
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

adminRouter.delete("/deleteUser/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "user deleted successfuly" });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

adminRouter.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate("userId", "firstName emailId")
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "order Not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "ordered items", data: orders });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});



module.exports = adminRouter;
