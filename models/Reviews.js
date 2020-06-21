const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Please add a rating between 1 and 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
// limiting user to adding only one review
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

//static method to get average rating of reviews
reviewSchema.statics.getAverageRating = async function (productId) {
  const obj = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        averageRate: { $avg: "$rating" },
      },
    },
  ]);
  try {
    await this.model("Product").findByIdAndUpdate(productId, {
      averageRate: obj[0].averageRate,
    });
  } catch (err) {
    console.error(err);
  }
};
// Call getAverageRate after save
reviewSchema.post("save", async function () {
  await this.constructor.getAverageRating(this.product);
});

// Call getAverageRate after remove
/*
reviewSchema.post("remove", async function () {
  await this.constructor.getAverageRating(this.product);
});*/
module.exports = mongoose.model("Review", reviewSchema);
