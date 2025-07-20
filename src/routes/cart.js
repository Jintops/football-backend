const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Cart = require("../models/cart");
const Product = require("../models/product");
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


cartRouter.get("/cartItems",userAuth,async(req,res)=>{
  try{
    const user=req.user;
    const item=await Cart.findOne({userId:user._id}).populate("items.productId")
    if(!item){
    return  res.status(404).json({success:false,message:"no Items found"})
    }
    
    res.status(200).json({success:true,data:item})
   
  }catch(err){
   res.status(400).send("ERROR :"+err.message)
  }
})

module.exports = cartRouter;
