const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/ascyncHandler");
const Order = require("../models/Orders");
const Product = require("../models/Products");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//Get all orders
//route /api/v1/orders
exports.getOrders = asyncHandler(async (req, res, next) => {
  /*if (req.params.userId) {
    let orders = await Order.find({ user: req.params.userId });
    return res
      .status(200)
      .json({ success: true, length: orders.length, data: orders });
  }*/
  // orders = await Order.find();
  res.status(200).json(res.advancedResults);
});
//Get orders for single user
//route /api/v1/orders/user
exports.getOrdersByUser = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).exec();
  if (!orders) {
    return next(new ErrorResponse(`no orders found for this user`, 404));
  }
  res.status(200).json({ success: true, length: orders.length, data: orders });
});
//Get order
//route /api/v1/orders/:id
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorResponse(`Order not found on this id ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({ success: true, data: order });
});
//Get orders by product
//route /api/v1/products/:productId/order
exports.getOrderByProduct = asyncHandler(async (req, res, next) => {
  //getting orders by product
  let order = await Order.findOne({ product: req.params.productId }).exec();
  //check order
  if (!order) {
    return next(
      new ErrorResponse(`Order not found on this id ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({ success: true, data: order });
});
//add orders
//route /api/v1/productId
exports.addOrder = asyncHandler(async (req, res, next) => {
  req.body.product = req.params.productId;
  req.body.user = req.user.id;
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new ErrorResponse(`no product with this id`, 404));
  }
  const order = await Order.create(req.body);
  //compare quantity with product count
  if (order.quantity > product.count) {
    return next(new ErrorResponse(`count of product is ${product.count}`));
  }
  // use payments
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "E-commerce app",
    });
    //check product count
    product.count = product.count - order.quantity;
    await product.save();
    if (product.count === 0) {
      await product.remove();
    }
    console.log(paymentIntent);
    return res
      .status(201)
      .json({ success: true, data: order, token: paymentIntent.client_secret });
  } catch (err) {
    return res.status(401).json({ msg: err.message });
    console.error(err);
  }
});
//update orders
//route /api/v1/prodcts/:productId/order
exports.updateOrder = asyncHandler(async (req, res, next) => {
  //getting order by product
  let order = await Order.findOne({ product: req.params.productId }).exec();
  //check order
  if (!order) {
    return next(
      new ErrorResponse(`Order not found on this id ${req.params.id}`, 404)
    );
  }
  order.user.toString() == req.user.id;
  let product = await Product.findById(req.params.productId);
  // return counts value to first case
  product.count = product.count + order.quantity;
  //await product.save();
  // update order
  order = await Order.findOneAndUpdate(
    { product: req.params.productId },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  //update counts according to new case
  product.count = product.count - order.quantity;
  await product.save();
  return res.status(200).json({ success: true, data: order });
});
//delete orders
//route /api/v1/prodcts/:productId/order
exports.removeOrder = asyncHandler(async (req, res, next) => {
  //getting order by product
  let order = await Order.findOne({ product: req.params.productId }).exec();
  //check order
  if (!order) {
    return next(
      new ErrorResponse(`Order not found on this id ${req.params.id}`, 404)
    );
  }
  order.user.toString() == req.user.id;

  let product = await Product.findById(req.params.productId);
  // return counts value to first case
  product.count = product.count + order.quantity;
  product.save();
  order = await Order.findOneAndDelete({ product: req.params.productId });
  await order.remove();
  return res.status(200).json({ success: true, data: {} });
});
