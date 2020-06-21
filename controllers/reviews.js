const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/ascyncHandler");
const Review = require("../models/Reviews");
const Product = require("../models/Products");
const User = require("../models/User");

// get all reviews
// routes  /api/v1/reviews
exports.getReviews = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
// get reviews by product
// routes /api/v1/products/productId/reviews
exports.getReviewByProduct = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId }).exec();
  if (!reviews) {
    return next(new ErrorResponse(`No reviews found with this product`), 404);
  }
  return res
    .status(200)
    .json({ success: true, length: reviews.length, data: reviews });
});
//get review by id
// route /api/v1/reviews/:id
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse(`no review found with this id`, 404));
  }
  return res.status(200).json({ success: true, data: review });
});
//add review
// route /api/v1/products/prpductId/reviews
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.product = req.params.productId;
  req.body.user = req.user.id;
  if (req.user.role !== "user") {
    return next(new ErrorResponse(`Not authorized to add review`, 401));
  }
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new ErrorResponse(`no product found with this id`, 404));
  }
  const review = await Review.create(req.body);
  return res.status(201).json({ success: true, data: review });
});
// update reviews
// route /api/v1/rerviews/:id
exports.updateReviews = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse(`no review found with this id`, 404));
  }
  if (review.user.toString() !== req.user.id || req.user.role !== "user") {
    return next(
      new ErrorResponse(`user role not authorize to update this review`, 401)
    );
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  await review.save();
  return res.status(200).json({ success: true, data: review });
});
/*
// delete reviews
// route /api/v1/rerviews/:id
exports.deleteReviews = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse(`no review found with this id`, 404));
  }
  if (review.user.toString() !== req.user.id || req.user.role !== "user") {
    return next(
      new ErrorResponse(`user role not authorize to delete this review`, 401)
    );
  }
  await review.remove();
  return res.status(200).json({ success: true, data: {} });
});*/
