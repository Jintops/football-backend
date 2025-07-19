const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default:
        "https://i.pinimg.com/736x/d7/fd/79/d7fd79788139d0a77d63aaf2e7c6d827.jpg",
    },
    price: {
      type: Number,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    salePrice: {
      type: Number,
    },
    brand: {
      type: String,
    },
    category: {
      type: String,
    },
    totalStock: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
