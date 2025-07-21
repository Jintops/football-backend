const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Cart = require("../models/cart");
const Product = require("../models/product");
const product = require("../models/product");
const cartRouter = express.Router();

cartRouter.post("/addToCart/:productId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({
        userId: user._id,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    const item = await cart.save();
    const populatedCart = await Cart.findById(item._id).populate(
      "items.productId",
      "title price image salePrice"
    );
    res
      .status(200)
      .json({ success: true, message: "added to cart", data: populatedCart });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

cartRouter.get("/cartItems", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const cart = await Cart.findOne({ userId: user._id }).populate(
      "items.productId",
      "title image price salePrice"
    );
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "no Items found" });
    }

    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length === 0) {
  await Cart.findByIdAndDelete(cart._id);
  return res.status(200).json({
    success: true,
    message: "Cart is empty and deleted.",
  });
}

    cart.items = validItems;
    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

cartRouter.patch("/deleteCartItem/:productId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.params;

    const updateItem = await Cart.findOneAndUpdate(
      { userId: user._id },
      { $pull: { items: { productId: productId } } },
      { new: true }
    ).populate("items.productId");

    if (!updateItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    if (updateItem.items.length === 0) {
      await Cart.findByIdAndDelete(updateItem._id);
      return res.status(200).json({
        success: true,
        message: "Item removed and cart is now empty. Cart deleted.",
      });
    }

    res.status(200).json({ success: true, data: updateItem });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

// cartRouter.patch("/deleteCartItem/:productId", userAuth, async (req, res) => {
//   try {
//     const user = req.user;
//     const { productId } = req.params;
//     const cart = await Cart.findOne({ userId: user._id });
//     if (!cart) {
//       return res.status(404).json({ success: false, message: "Cart not found" });
//     }
//     // Filter out the item
//     cart.items = cart.items.filter(
//       (item) => item.productId.toString() !== productId
//     );
//     // Delete cart if no items left
//     if (cart.items.length === 0) {
//       await Cart.findByIdAndDelete(cart._id);
//       return res.status(200).json({
//         success: true,
//         message: "Item removed and cart is now empty. Cart deleted.",
//       });
//     }
//     const updatedCart = await cart.save();
//     const populatedCart = await Cart.findById(updatedCart._id).populate("items.productId");
//     res.status(200).json({ success: true, data: populatedCart });
//   } catch (err) {
//     res.status(400).send("ERROR: " + err.message);
//   }
// });

cartRouter.delete("/removeCart", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const cart = await Cart.findOneAndDelete({ userId: user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "no items" });
    }

    res.status(200).json({ success: true, message: "removed all items" });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = cartRouter;
