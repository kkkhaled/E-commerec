const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  quantity: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    //required: true,
  },
});
module.exports = mongoose.model("Order", orderSchema);
