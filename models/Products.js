const mongoose = require("mongoose");
const slugify = require("slugify");
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a name"],
      trim: true,
      maxlength: [30, " name cannot be more 30 character"],
    },
    kinds: {
      type: String,
      enum: [
        "electronics",
        "phones or tabs",
        "laptops",
        "health",
        "sports",
        "clothes",
        "others",
      ],
      required: true,
    },
    price: {
      type: Number,
      required: [true, "please enter the price"],
    },
    count: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      default: "No Photo.jpg",
    },
    description: {
      type: String,
      maxlength: [700, "description cannot be more than 700 character"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    averageRate: {
      type: Number,
      min: [1, "rating cannot be less than 1"],
      max: [5, "rating cannot be more than 5"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// virtuals populate
productSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});
//Delete order after delete products
productSchema.pre("remove", async function (next) {
  console.log(`order have been removed `);
  await this.model("Order").deleteMany({ product: this._id });
  next();
});
//Delete order after delete products
productSchema.pre("remove", async function (next) {
  console.log(`reviews have been removed `);
  await this.model("Review").deleteMany({ product: this._id });
  next();
});
module.exports = mongoose.model("Product", productSchema);
