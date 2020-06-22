const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/ascyncHandler");
//const advancedQueries = require("../middleware/queries");
const User = require("../models/User");
const Product = require("../models/Products");
const mongoose = require("mongoose");

//Get all products
//route /api/v1/products
//Get products for single user
//route /api/vi/users/userId/products
exports.getProducts = asyncHandler(async (req, res, next) => {
  /* if (req.params.userId) {
    let products = await Product.find({ user: req.params.userId });
    return res.status(200).json({
      success: true,
      length: products.length,
      data: products,
    });
    const products = await Product.find();
    res.status(200).json({
      success: true,
      length: products.length,
      data: products,
    });
    */
  res.status(200).json(res.advancedResults);
});
//Get products for single user
//route /api/v1/products/user
exports.getProductsByUser = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ user: req.user.id }).exec();
  if (!products) {
    return next(new ErrorResponse(`no products found for this user`, 404));
  }
  res
    .status(200)
    .json({ success: true, length: products.length, data: products });
});
//Get Single products
//route /api/v1/products/:id
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(
        `Prouduct not found with this id : ${req.params.id}`,
        404
      )
    );
  }
  return res.status(200).json({
    success: true,
    data: product,
  });
});
//Create Product
//route /api/v1/products
exports.addProduct = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to add product`, 401));
  }
  const product = await Product.create(req.body);
  return res.status(201).json({ success: true, data: product });
});
// upload images for product
// aroute /api/v1/products/:id/image
exports.uploadImage = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(
        `Product not found with this id : ${req.params.id}`,
        404
      )
    );
  }
  if (product.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(`user role not authorize to access this route`)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  let file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`File Can be a image only`, 400));
  }
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(new ErrorResponse(`file cannot be more than 5 mb`, 400));
  }
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return res.staus(500).json(`cannot upload file`);
    } else {
      await Product.findByIdAndUpdate(req.params.id, { image: file.name });
      res.status(200).json({
        success: true,
        image: file.name,
      });
    }
  });
});
// update product
// aroute /api/v1/products/:id
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(
        `Prouduct not found with this id : ${req.params.id}`,
        404
      )
    );
  }
  if (product.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(`user role not authorize to access this route`)
    );
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    data: product,
  });
});
// delete product
// aroute /api/v1/products/:id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(
        `Prouduct not found with this id : ${req.params.id}`,
        404
      )
    );
  }
  if (product.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(`user role not authorize to access this route`)
    );
  }
  await product.remove();
  return res.status(200).json({
    success: true,
    data: {},
  });
});
