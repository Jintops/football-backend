const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    address: {
      name: { type: String, required: true },
      fullAddress: { type: String, required: true },
      pincode: { type: Number, required: true },
      place: { type: String, required: true },
      phone: { type: String, required: true },
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Online"],
      required: true,
    },
    totalAmount: {
      type: String,
      required: true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
